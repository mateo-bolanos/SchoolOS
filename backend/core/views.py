from django.http import JsonResponse


def healthz(_request):
    """Return a lightweight success payload for health checks."""
    return JsonResponse({"status": "ok"})
