"""API URL configuration for the SchoolOS backend."""
from __future__ import annotations

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AssignmentsViewSet,
    CoursesView,
    DashboardStatsView,
    MeView,
    SectionGradebookView,
    SectionRosterView,
)

app_name = "api"

router = DefaultRouter()
router.register(r"assignments", AssignmentsViewSet, basename="assignment")

urlpatterns = [
    path("me", MeView.as_view(), name="me"),
    path("dashboard/stats", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("courses", CoursesView.as_view(), name="courses"),
    path(
        "sections/<int:section_id>/roster",
        SectionRosterView.as_view(),
        name="section-roster",
    ),
    path(
        "sections/<int:section_id>/gradebook",
        SectionGradebookView.as_view(),
        name="section-gradebook",
    ),
]

urlpatterns += router.urls
