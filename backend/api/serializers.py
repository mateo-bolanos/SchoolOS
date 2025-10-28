"""Serializers for the SchoolOS API."""
from __future__ import annotations

from rest_framework import serializers


class AssignmentSerializer(serializers.Serializer):
    """Serializer defining the assignment contract."""

    id = serializers.IntegerField(read_only=True)
    course_id = serializers.IntegerField()
    section_id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True)
    due_date = serializers.DateField()
    points_possible = serializers.IntegerField(min_value=0)
    category = serializers.CharField(max_length=128)
