#!/usr/bin/env python3
"""Utility to sync GitHub issues and labels from docs/PROJECT_PLAN.md.

The script parses the "Labels" and "Issue Backlog" tables contained in the
project plan document and creates (or updates) the corresponding labels and
issues in the target GitHub repository.

Usage:
    python scripts/create_github_issues.py --repo owner/name [--dry-run]

Required environment variables:
    GITHUB_TOKEN  - Personal access token with `repo` scope (or GH Actions token).

The default repository is read from the `GITHUB_REPOSITORY` environment variable
when `--repo` is omitted, which matches the convention used inside GitHub
Actions.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence
from urllib.parse import urlencode
from urllib.request import Request, urlopen

PROJECT_PLAN_PATH = Path("docs/PROJECT_PLAN.md")
GITHUB_API_URL = "https://api.github.com"


class PlanParseError(RuntimeError):
    """Raised when the project plan cannot be parsed as expected."""


class GitHubClient:
    def __init__(self, token: str | None):
        self.token = token

    def request(
        self,
        method: str,
        url: str,
        *,
        expected: Iterable[int] = (200, 201),
        params: dict[str, str] | None = None,
        json_data: dict | None = None,
    ) -> tuple[int, bytes]:
        final_url = url
        if params:
            final_url = f"{url}?{urlencode(params)}"

        data: bytes | None = None
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "schoolos-issue-sync-script",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        if json_data is not None:
            data = json.dumps(json_data).encode("utf-8")
            headers["Content-Type"] = "application/json"

        request = Request(final_url, data=data, headers=headers, method=method.upper())
        try:
            with urlopen(request, timeout=30) as response:
                status = response.status
                body = response.read()
        except Exception as exc:  # pragma: no cover - network errors are surfaced directly
            raise RuntimeError(f"GitHub API request to {final_url} failed: {exc}") from exc

        if status not in expected:
            body_text = body.decode("utf-8", errors="replace")
            raise RuntimeError(
                f"GitHub API request to {final_url} failed with status {status}: {body_text}"
            )

        return status, body

    def request_json(
        self,
        method: str,
        url: str,
        *,
        expected: Iterable[int] = (200, 201),
        params: dict[str, str] | None = None,
        json_data: dict | None = None,
    ):
        status, body = self.request(method, url, expected=expected, params=params, json_data=json_data)
        if not body:
            return status, None
        return status, json.loads(body.decode("utf-8"))


@dataclass
class LabelDefinition:
    name: str
    description: str

    @property
    def color(self) -> str:
        """Derive a stable hex color from the label name."""

        digest = hashlib.md5(self.name.encode("utf-8"), usedforsecurity=False).hexdigest()
        # Use the first six characters for a RGB hex, ensuring it isn't too light.
        base = digest[:6]
        # Darken overly bright colors to keep contrast acceptable.
        channels = [max(0x10, int(base[i : i + 2], 16) - 0x20) for i in range(0, 6, 2)]
        return "".join(f"{c:02x}" for c in channels)


@dataclass
class IssueDefinition:
    title: str
    description: str
    labels: List[str]
    agent_prompt: str
    epic: str

    def build_body(self) -> str:
        """Compose the GitHub issue body."""

        lines = [self.description.strip()]
        lines.append("")
        lines.append(f"**Epic:** {self.epic}")
        lines.append("")
        lines.append("**Agent Prompt**")
        lines.append(self.agent_prompt.strip())
        return "\n".join(lines).strip()


@dataclass
class PlanData:
    labels: List[LabelDefinition]
    issues: List[IssueDefinition]


def _extract_table(lines: Sequence[str], start_index: int) -> List[List[str]]:
    """Read a Markdown table starting at ``start_index``.

    The function stops when it encounters a non-table line.
    """

    rows: List[List[str]] = []
    i = start_index
    # Skip the header separator line (---) if present.
    while i < len(lines) and lines[i].strip() == "":
        i += 1
    if i >= len(lines) or not lines[i].strip().startswith("|"):
        raise PlanParseError("Expected table header starting with '|' symbol")
    # Skip header + delimiter rows.
    i += 2
    while i < len(lines):
        line = lines[i].strip()
        if not line.startswith("|"):
            break
        parts = [part.strip() for part in line.strip("|").split("|")]
        rows.append(parts)
        i += 1
    return rows


def _parse_plan(path: Path) -> PlanData:
    if not path.exists():
        raise FileNotFoundError(f"Project plan not found: {path}")

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    labels: List[LabelDefinition] = []
    issues: List[IssueDefinition] = []

    # Parse labels table.
    label_header = "## 🧭 Labels"
    try:
        label_index = lines.index(label_header)
    except ValueError as exc:
        raise PlanParseError("Could not find the labels section in the project plan") from exc
    label_rows = _extract_table(lines, label_index + 1)
    for row in label_rows:
        if len(row) < 2:
            continue
        raw_name = row[0].strip()
        if raw_name.startswith("`") and raw_name.endswith("`") and len(raw_name) >= 2:
            raw_name = raw_name[1:-1]
        labels.append(LabelDefinition(name=raw_name, description=row[1]))

    # Parse issues grouped by epic.
    for i, line in enumerate(lines):
        if line.startswith("### EPIC "):
            epic_title = line.replace("### ", "").strip()
            table_rows = _extract_table(lines, i + 1)
            for row in table_rows:
                if len(row) < 4:
                    continue
                title = row[0]
                description = row[1]
                label_list = [label.strip() for label in row[2].split(",") if label.strip()]
                agent_prompt = row[3]
                issues.append(
                    IssueDefinition(
                        title=title,
                        description=description,
                        labels=label_list,
                        agent_prompt=agent_prompt,
                        epic=epic_title,
                    )
                )
    if not issues:
        raise PlanParseError("No issues found while parsing the project plan")

    return PlanData(labels=labels, issues=issues)


def ensure_labels(client: GitHubClient, repo: str, labels: Sequence[LabelDefinition], dry_run: bool = False) -> None:
    for label in labels:
        payload = {"name": label.name, "color": label.color, "description": label.description[:1000]}
        if dry_run:
            print(f"[DRY-RUN] ensure label: {payload}")
            continue
        status, existing = client.request_json(
            "get",
            f"{GITHUB_API_URL}/repos/{repo}/labels/{label.name}",
            expected=(200, 404),
        )
        if status == 200 and existing is not None:
            needs_update = (
                existing.get("color", "").lower() != label.color.lower()
                or (existing.get("description") or "") != label.description[:1000]
            )
            if needs_update:
                client.request_json(
                    "patch",
                    f"{GITHUB_API_URL}/repos/{repo}/labels/{label.name}",
                    expected=(200,),
                    json_data=payload,
                )
        elif status == 404:
            client.request_json(
                "post",
                f"{GITHUB_API_URL}/repos/{repo}/labels",
                expected=(201,),
                json_data=payload,
            )
        else:
            raise RuntimeError(
                f"Failed to inspect label '{label.name}': unexpected status {status}"
            )


def _load_existing_issue_titles(client: GitHubClient, repo: str) -> set[str]:
    titles: set[str] = set()
    page = 1
    while True:
        _, items = client.request_json(
            "get",
            f"{GITHUB_API_URL}/repos/{repo}/issues",
            expected=(200,),
            params={"state": "all", "per_page": "100", "page": str(page)},
        )
        if not items:
            break
        for item in items:
            if "pull_request" in item:
                continue
            titles.add(item.get("title", ""))
        if len(items) < 100:
            break
        page += 1
    return titles


def create_issues(client: GitHubClient, repo: str, issues: Sequence[IssueDefinition], dry_run: bool = False) -> None:
    existing_titles = _load_existing_issue_titles(client, repo) if not dry_run else set()

    for issue in issues:
        if issue.title in existing_titles:
            print(f"Skipping existing issue: {issue.title}")
            continue

        payload = {"title": issue.title, "body": issue.build_body(), "labels": issue.labels}
        if dry_run:
            print(f"[DRY-RUN] create issue: {payload['title']} -> labels={payload['labels']}")
            continue
        client.request_json(
            "post",
            f"{GITHUB_API_URL}/repos/{repo}/issues",
            expected=(201,),
            json_data=payload,
        )


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo",
        help="Target repository in 'owner/name' format. Defaults to GITHUB_REPOSITORY env var.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print actions without calling the GitHub API.")
    return parser.parse_args(argv)


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)

    repo = args.repo or os.getenv("GITHUB_REPOSITORY")
    if not repo:
        print("Error: repository not provided. Use --repo or set GITHUB_REPOSITORY.", file=sys.stderr)
        return 1

    token = os.getenv("GITHUB_TOKEN")
    if not token and not args.dry_run:
        print("Error: GITHUB_TOKEN environment variable is required.", file=sys.stderr)
        return 1

    plan = _parse_plan(PROJECT_PLAN_PATH)

    client = GitHubClient(token)

    ensure_labels(client, repo, plan.labels, dry_run=args.dry_run)
    create_issues(client, repo, plan.issues, dry_run=args.dry_run)

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
