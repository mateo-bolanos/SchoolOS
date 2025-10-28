from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from integrations import gmail_service, google_classroom, google_oauth  # noqa: E402


def test_google_oauth_generate_authorization_url(monkeypatch):
    config = google_oauth.GoogleOAuthConfig(
        client_id="client-id",
        client_secret="client-secret",
        redirect_uri="https://schoolos.local/auth/google/callback",
        scopes=("openid", "email"),
    )

    dummy_flow = SimpleNamespace()

    def _auth_url(**kwargs):
        dummy_flow.called_with = kwargs
        return "https://accounts.google.com/auth", "state-123"

    dummy_flow.authorization_url = _auth_url
    dummy_flow.fetch_token = lambda **_: None

    class DummyFlowFactory:
        @classmethod
        def from_client_config(cls, client_config, scopes, redirect_uri=None):
            DummyFlowFactory.received = {
                "client_config": client_config,
                "scopes": scopes,
                "redirect_uri": redirect_uri,
            }
            return dummy_flow

    monkeypatch.setattr(google_oauth, "_get_flow_factory", lambda: DummyFlowFactory)

    service = google_oauth.GoogleOAuthService(config)
    url, state = service.generate_authorization_url(state="expected-state")

    assert url == "https://accounts.google.com/auth"
    assert state == "state-123"
    assert dummy_flow.called_with == {
        "access_type": "offline",
        "include_granted_scopes": True,
        "prompt": "consent",
        "state": "expected-state",
    }
    assert DummyFlowFactory.received["redirect_uri"] == config.redirect_uri


def test_google_oauth_refresh(monkeypatch):
    captured_kwargs = {}

    class DummyCredentials:
        def __init__(self, **kwargs):
            captured_kwargs.update(kwargs)
            self.refreshed = False

        def refresh(self, request):
            self.refreshed = request

    dummy_request = object()

    monkeypatch.setattr(google_oauth, "_credentials_class", lambda: DummyCredentials)
    monkeypatch.setattr(google_oauth, "_build_request", lambda: dummy_request)

    config = google_oauth.GoogleOAuthConfig(
        client_id="client-id",
        client_secret="client-secret",
        redirect_uri="https://schoolos.local/auth/google/callback",
        scopes=("openid",),
    )
    service = google_oauth.GoogleOAuthService(config)

    credentials = service.refresh(refresh_token="refresh-token")

    assert captured_kwargs == {
        "token": None,
        "refresh_token": "refresh-token",
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_id": "client-id",
        "client_secret": "client-secret",
        "scopes": ("openid",),
    }
    assert credentials.refreshed is dummy_request


def test_google_classroom_list_courses(monkeypatch):
    captured_params = {}

    class CoursesResource:
        def list(self, **kwargs):
            captured_params.update(kwargs)

            class Request:
                @staticmethod
                def execute():
                    return {"courses": [{"id": "course-1"}]}

            return Request()

    class Service:
        def courses(self):
            return CoursesResource()

    monkeypatch.setattr(
        google_classroom,
        "_build_classroom_service",
        lambda credentials: Service(),
    )

    service = google_classroom.GoogleClassroomService(credentials=object())
    courses = service.list_courses(teacher_id="teacher-1", course_states=["ACTIVE"], page_size=10)

    assert courses == [{"id": "course-1"}]
    assert captured_params == {
        "pageSize": 10,
        "teacherId": "teacher-1",
        "courseStates": ["ACTIVE"],
    }


def test_google_classroom_create_coursework(monkeypatch):
    captured_body = {}

    class CourseWorkResource:
        def create(self, **kwargs):
            captured_body.update(kwargs)

            class Request:
                @staticmethod
                def execute():
                    return {"id": "coursework-1"}

            return Request()

    class CoursesResource:
        def courseWork(self):
            return CourseWorkResource()

    class Service:
        def courses(self):
            return CoursesResource()

    monkeypatch.setattr(
        google_classroom,
        "_build_classroom_service",
        lambda credentials: Service(),
    )

    service = google_classroom.GoogleClassroomService(credentials=object())
    result = service.create_coursework("course-42", {"title": "Essay"})

    assert result == {"id": "coursework-1"}
    assert captured_body == {
        "courseId": "course-42",
        "body": {"title": "Essay"},
    }


def test_gmail_send_message(monkeypatch):
    captured_payload = {}

    class MessagesResource:
        def send(self, **kwargs):
            captured_payload.update(kwargs)

            class Request:
                @staticmethod
                def execute():
                    return {"id": "message-1"}

            return Request()

        def list(self, **kwargs):  # pragma: no cover - not used in this test
            raise AssertionError("list should not be called")

    class UsersResource:
        def messages(self):
            return MessagesResource()

    class Service:
        def users(self):
            return UsersResource()

    monkeypatch.setattr(gmail_service, "_build_gmail_service", lambda credentials: Service())

    service = gmail_service.GmailService(credentials=object())
    message = service.build_message(
        sender="teacher@schoolos.com",
        to=["student@schoolos.com"],
        subject="Reminder",
        body="Please submit your assignment.",
    )
    response = service.send_message(message)

    assert response == {"id": "message-1"}
    assert captured_payload["userId"] == "me"
    assert "raw" in captured_payload["body"]


def test_gmail_list_messages(monkeypatch):
    captured_params = {}

    class MessagesResource:
        def list(self, **kwargs):
            captured_params.update(kwargs)

            class Request:
                @staticmethod
                def execute():
                    return {"messages": [{"id": "msg-1"}]}

            return Request()

        def send(self, **kwargs):  # pragma: no cover - not used in this test
            raise AssertionError("send should not be called")

    class UsersResource:
        def messages(self):
            return MessagesResource()

    class Service:
        def users(self):
            return UsersResource()

    monkeypatch.setattr(gmail_service, "_build_gmail_service", lambda credentials: Service())

    service = gmail_service.GmailService(credentials=object())
    messages = service.list_messages(label_ids=["INBOX"], max_results=5, page_token="token")

    assert messages == [{"id": "msg-1"}]
    assert captured_params == {
        "maxResults": 5,
        "labelIds": ["INBOX"],
        "pageToken": "token",
        "userId": "me",
    }
