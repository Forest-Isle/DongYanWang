import uuid
from django.utils.deprecation import MiddlewareMixin

REQUEST_ID_HEADER = "HTTP_X_REQUEST_ID"

class RequestIDMiddleware(MiddlewareMixin):
    def process_request(self, request):
        rid = request.META.get(REQUEST_ID_HEADER)
        if not rid:
            rid = uuid.uuid4().hex
        request.request_id = rid

    def process_response(self, request, response):
        rid = getattr(request, "request_id", None)
        if rid:
            response["X-Request-ID"] = rid
        return response
