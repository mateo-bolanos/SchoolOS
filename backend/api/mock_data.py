"""Mock data fixtures for the SchoolOS API."""
from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from datetime import date
from typing import Dict, List


ME_PAYLOAD = {
    "id": 1,
    "first_name": "Jordan",
    "last_name": "Rivera",
    "email": "jordan.rivera@example.edu",
    "role": "teacher",
    "permissions": ["courses:view", "assignments:grade", "reports:generate"],
}

DASHBOARD_STATS = {
    "sections": 3,
    "students": 74,
    "assignments_due": 5,
    "assignments_to_grade": 12,
    "attendance_rate": 0.96,
}

COURSES = [
    {
        "id": 101,
        "name": "Algebra II",
        "code": "MATH-201",
        "term": "2024-2025",
        "sections": [
            {"id": 301, "name": "Period 1", "enrollment": 26},
            {"id": 302, "name": "Period 3", "enrollment": 24},
        ],
    },
    {
        "id": 102,
        "name": "Physics",
        "code": "SCI-110",
        "term": "2024-2025",
        "sections": [
            {"id": 303, "name": "Period 4", "enrollment": 24},
        ],
    },
]

SECTION_ROSTERS = {
    301: {
        "section_id": 301,
        "students": [
            {"id": 501, "first_name": "Alice", "last_name": "Nguyen"},
            {"id": 502, "first_name": "Miguel", "last_name": "Lopez"},
            {"id": 503, "first_name": "Priya", "last_name": "Singh"},
        ],
    },
    302: {
        "section_id": 302,
        "students": [
            {"id": 504, "first_name": "Jon", "last_name": "Martinez"},
            {"id": 505, "first_name": "Keisha", "last_name": "Wright"},
        ],
    },
    303: {
        "section_id": 303,
        "students": [
            {"id": 506, "first_name": "Cam", "last_name": "Davis"},
            {"id": 507, "first_name": "Noah", "last_name": "Kim"},
        ],
    },
}

SECTION_GRADEBOOKS = {
    301: {
        "section_id": 301,
        "grading_period": "Fall 2024",
        "assignments": [
            {"id": 1, "title": "Quiz: Linear Functions", "points_possible": 20},
            {"id": 2, "title": "Homework Set 3", "points_possible": 15},
        ],
        "students": [
            {
                "student_id": 501,
                "name": "Alice Nguyen",
                "grades": {1: 18, 2: 15},
            },
            {
                "student_id": 502,
                "name": "Miguel Lopez",
                "grades": {1: 15, 2: 12},
            },
            {
                "student_id": 503,
                "name": "Priya Singh",
                "grades": {1: 19, 2: 15},
            },
        ],
    }
}


@dataclass
class MockAssignmentStore:
    """A lightweight in-memory store for assignment mocks."""

    _items: Dict[int, dict] = field(default_factory=dict)
    _next_id: int = 1

    def __post_init__(self) -> None:
        if not self._items:
            self.reset()

    def reset(self) -> None:
        """Reset the store to its initial fixture state."""
        fixtures = [
            {
                "id": 1,
                "course_id": 101,
                "section_id": 301,
                "title": "Quiz: Linear Functions",
                "description": "Assess understanding of slope-intercept form.",
                "due_date": date(2024, 9, 20).isoformat(),
                "points_possible": 20,
                "category": "Quiz",
            },
            {
                "id": 2,
                "course_id": 101,
                "section_id": 301,
                "title": "Homework Set 3",
                "description": "Practice problems on systems of equations.",
                "due_date": date(2024, 9, 25).isoformat(),
                "points_possible": 15,
                "category": "Homework",
            },
        ]
        self._items = {item["id"]: item for item in fixtures}
        self._next_id = max(self._items) + 1

    def all(self) -> List[dict]:
        return [deepcopy(self._items[key]) for key in sorted(self._items)]

    def get(self, assignment_id: int) -> dict | None:
        item = self._items.get(assignment_id)
        return deepcopy(item) if item else None

    def create(self, payload: dict) -> dict:
        assignment = deepcopy(payload)
        assignment["id"] = self._next_id
        self._next_id += 1
        self._items[assignment["id"]] = assignment
        return deepcopy(assignment)

    def update(self, assignment_id: int, payload: dict) -> dict | None:
        if assignment_id not in self._items:
            return None
        updated = deepcopy(payload)
        updated["id"] = assignment_id
        self._items[assignment_id] = updated
        return deepcopy(updated)

    def delete(self, assignment_id: int) -> bool:
        return self._items.pop(assignment_id, None) is not None


ASSIGNMENT_STORE = MockAssignmentStore()


def reset_assignments() -> None:
    """Reset the assignment store to its initial fixtures."""
    ASSIGNMENT_STORE.reset()
