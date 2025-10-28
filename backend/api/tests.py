"""API contract tests for mock-enabled endpoints."""
from __future__ import annotations

from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from . import mock_data


@override_settings(ENABLE_MOCK_DATA=True)
class APIMockContractTests(TestCase):
    """Validate the mock-backed API contracts."""

    client_class = APIClient

    def setUp(self):
        super().setUp()
        mock_data.reset_assignments()

    def test_me_endpoint_returns_mock_profile(self):
        response = self.client.get(reverse("api:me"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], mock_data.ME_PAYLOAD["email"])

    def test_dashboard_stats_returns_expected_shape(self):
        response = self.client.get(reverse("api:dashboard-stats"))
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        for key in ("sections", "students", "assignments_due"):
            self.assertIn(key, payload)

    def test_courses_returns_course_catalog(self):
        response = self.client.get(reverse("api:courses"))
        self.assertEqual(response.status_code, 200)
        catalog = response.json()
        self.assertGreaterEqual(len(catalog), 1)
        self.assertIn("sections", catalog[0])

    def test_section_roster_returns_students(self):
        section_id = 301
        response = self.client.get(
            reverse("api:section-roster", kwargs={"section_id": section_id})
        )
        self.assertEqual(response.status_code, 200)
        roster = response.json()
        self.assertEqual(roster["section_id"], section_id)
        self.assertGreaterEqual(len(roster["students"]), 1)

    def test_assignments_crud_flow(self):
        list_url = reverse("api:assignment-list")
        initial = self.client.get(list_url)
        self.assertEqual(initial.status_code, 200)
        starting_count = len(initial.json())

        create_payload = {
            "course_id": 101,
            "section_id": 301,
            "title": "Project: Quadratic Models",
            "description": "Group project exploring quadratic equations.",
            "due_date": "2024-10-10",
            "points_possible": 50,
            "category": "Project",
        }
        created = self.client.post(list_url, create_payload, format="json")
        self.assertEqual(created.status_code, 201)
        created_id = created.json()["id"]

        detail_url = reverse("api:assignment-detail", args=[created_id])
        fetched = self.client.get(detail_url)
        self.assertEqual(fetched.status_code, 200)
        self.assertEqual(fetched.json()["title"], create_payload["title"])

        update_payload = {
            **create_payload,
            "title": "Updated Project: Quadratic Models",
        }
        updated = self.client.put(detail_url, update_payload, format="json")
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.json()["title"], update_payload["title"])

        partial = self.client.patch(
            detail_url,
            {"points_possible": 55},
            format="json",
        )
        self.assertEqual(partial.status_code, 200)
        self.assertEqual(partial.json()["points_possible"], 55)

        deleted = self.client.delete(detail_url)
        self.assertEqual(deleted.status_code, 204)

        final = self.client.get(list_url)
        self.assertEqual(len(final.json()), starting_count)
