"""URL configuration for the SchoolOS backend project."""
from django.contrib import admin
from django.urls import include, path

from core.views import healthz

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("api.urls")),
    path("healthz", healthz, name="healthz"),
]
