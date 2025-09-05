from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType

@api_view(["GET"])
def list_content_types(request):
    data = ContentType.objects.all().values("id", "app_label", "model")
    return Response(list(data))