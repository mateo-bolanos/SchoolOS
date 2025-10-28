"""API views for the SchoolOS backend."""
from __future__ import annotations

from django.conf import settings
from django.http import Http404
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from . import mock_data
from .serializers import AssignmentSerializer


def _mock_enabled() -> bool:
    return getattr(settings, "ENABLE_MOCK_DATA", False)


def _mock_disabled_response() -> Response:
    return Response(
        {"detail": "Mock data feature flag disabled."},
        status=status.HTTP_501_NOT_IMPLEMENTED,
    )


class MeView(APIView):
    """Return the authenticated user's profile."""

    def get(self, _request):
        if not _mock_enabled():
            return _mock_disabled_response()
        return Response(mock_data.ME_PAYLOAD)


class DashboardStatsView(APIView):
    """Return aggregated dashboard statistics for the teacher."""

    def get(self, _request):
        if not _mock_enabled():
            return _mock_disabled_response()
        return Response(mock_data.DASHBOARD_STATS)


class CoursesView(APIView):
    """Return the course catalog for the current user."""

    def get(self, _request):
        if not _mock_enabled():
            return _mock_disabled_response()
        return Response(mock_data.COURSES)


class SectionRosterView(APIView):
    """Return roster details for the requested section."""

    def get(self, _request, section_id: int):
        if not _mock_enabled():
            return _mock_disabled_response()
        roster = mock_data.SECTION_ROSTERS.get(section_id)
        if not roster:
            raise Http404("Section not found")
        return Response(roster)


class SectionGradebookView(APIView):
    """Return gradebook details for the requested section."""

    def get(self, _request, section_id: int):
        if not _mock_enabled():
            return _mock_disabled_response()
        gradebook = mock_data.SECTION_GRADEBOOKS.get(section_id)
        if not gradebook:
            raise Http404("Section not found")
        return Response(gradebook)


class AssignmentsViewSet(viewsets.ViewSet):
    """CRUD operations for assignments using the mock fixture store."""

    serializer_class = AssignmentSerializer

    @staticmethod
    def _resolve_pk(pk: str | None) -> int | None:
        try:
            return int(pk) if pk is not None else None
        except (TypeError, ValueError):  # pragma: no cover - defensive
            raise Http404("Assignment not found")

    def _get_assignment(self, pk: str | None):
        assignment_id = self._resolve_pk(pk)
        if assignment_id is None:
            raise Http404("Assignment not found")
        assignment = mock_data.ASSIGNMENT_STORE.get(assignment_id)
        if not assignment:
            raise Http404("Assignment not found")
        return assignment

    def list(self, _request):
        if not _mock_enabled():
            return _mock_disabled_response()
        assignments = mock_data.ASSIGNMENT_STORE.all()
        serializer = self.serializer_class(assignments, many=True)
        return Response(serializer.data)

    def retrieve(self, _request, pk: str | None = None):
        if not _mock_enabled():
            return _mock_disabled_response()
        assignment = self._get_assignment(pk)
        serializer = self.serializer_class(assignment)
        return Response(serializer.data)

    def create(self, request):
        if not _mock_enabled():
            return _mock_disabled_response()
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        created = mock_data.ASSIGNMENT_STORE.create(serializer.validated_data)
        return Response(created, status=status.HTTP_201_CREATED)

    def update(self, request, pk: str | None = None):
        if not _mock_enabled():
            return _mock_disabled_response()
        existing = self._get_assignment(pk)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated = mock_data.ASSIGNMENT_STORE.update(existing["id"], serializer.validated_data)
        return Response(updated)

    def destroy(self, _request, pk: str | None = None):
        if not _mock_enabled():
            return _mock_disabled_response()
        assignment_id = self._resolve_pk(pk)
        if assignment_id is None:
            raise Http404("Assignment not found")
        deleted = mock_data.ASSIGNMENT_STORE.delete(assignment_id)
        if not deleted:
            raise Http404("Assignment not found")
        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, pk: str | None = None):
        if not _mock_enabled():
            return _mock_disabled_response()
        existing = self._get_assignment(pk)
        serializer = self.serializer_class(
            data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        merged_payload = {**existing, **serializer.validated_data}
        updated = mock_data.ASSIGNMENT_STORE.update(existing["id"], merged_payload)
        return Response(updated)
