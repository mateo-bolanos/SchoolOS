"""Google Classroom service wrapper."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Mapping, Optional, cast


@dataclass
class GoogleClassroomConfig:
    """Configuration values for the Google Classroom API."""

    application_name: str
    scopes: tuple[str, ...]

    @classmethod
    def from_env(
        cls, env: Optional[Mapping[str, str]] = None
    ) -> "GoogleClassroomConfig":
        env_mapping = env or os.environ
        default_scopes = (
            "https://www.googleapis.com/auth/classroom.courses.readonly",
            "https://www.googleapis.com/auth/classroom.coursework.students",
        )
        raw_scopes = env_mapping.get("GOOGLE_CLASSROOM_SCOPES")
        scopes = (
            tuple(scope.strip() for scope in raw_scopes.split(",") if scope.strip())
            if raw_scopes
            else default_scopes
        )
        return cls(
            application_name=env_mapping.get("GOOGLE_CLASSROOM_APP", "SchoolOS"),
            scopes=scopes,
        )


def _build_classroom_service(credentials):
    try:
        from googleapiclient.discovery import build
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError(
            "google-api-python-client is required for Google Classroom integration"
        ) from exc
    return build("classroom", "v1", credentials=credentials, cache_discovery=False)


class GoogleClassroomService:
    """High-level helper around the Google Classroom API."""

    def __init__(
        self,
        credentials,
        *,
        config: Optional[GoogleClassroomConfig] = None,
    ) -> None:
        self._credentials = credentials
        self.config = config or GoogleClassroomConfig.from_env()
        self._service_client = None

    def _get_service(self):
        if self._service_client is None:
            self._service_client = _build_classroom_service(self._credentials)
        return self._service_client

    def list_courses(
        self,
        *,
        teacher_id: Optional[str] = None,
        student_id: Optional[str] = None,
        course_states: Optional[Iterable[str]] = None,
        page_size: int = 100,
        page_token: Optional[str] = None,
    ) -> List[Mapping[str, Any]]:
        """List available Google Classroom courses for the authenticated user."""

        params: Dict[str, Any] = {"pageSize": page_size}
        if teacher_id:
            params["teacherId"] = teacher_id
        if student_id:
            params["studentId"] = student_id
        if course_states:
            params["courseStates"] = list(course_states)
        if page_token:
            params["pageToken"] = page_token

        response = self._get_service().courses().list(**params).execute()
        return list(response.get("courses", []))

    def list_coursework(
        self,
        course_id: str,
        *,
        page_size: int = 100,
        page_token: Optional[str] = None,
    ) -> List[Mapping[str, Any]]:
        """List coursework for a course."""

        params: Dict[str, Any] = {"pageSize": page_size}
        if page_token:
            params["pageToken"] = page_token
        response = (
            self._get_service()
            .courses()
            .courseWork()
            .list(courseId=course_id, **params)
            .execute()
        )
        return list(response.get("courseWork", []))

    def create_coursework(self, course_id: str, body: Mapping[str, Any]) -> Mapping[str, Any]:
        """Create coursework within a Google Classroom course."""

        request = (
            self._get_service()
            .courses()
            .courseWork()
            .create(courseId=course_id, body=dict(body))
        )
        return cast(Mapping[str, Any], request.execute())

    def get_student_submissions(
        self,
        course_id: str,
        coursework_id: str,
        *,
        page_size: int = 30,
        page_token: Optional[str] = None,
    ) -> List[Mapping[str, Any]]:
        params: Dict[str, Any] = {"pageSize": page_size}
        if page_token:
            params["pageToken"] = page_token
        response = (
            self._get_service()
            .courses()
            .courseWork()
            .studentSubmissions()
            .list(courseId=course_id, courseWorkId=coursework_id, **params)
            .execute()
        )
        return list(response.get("studentSubmissions", []))


__all__ = [
    "GoogleClassroomConfig",
    "GoogleClassroomService",
]
