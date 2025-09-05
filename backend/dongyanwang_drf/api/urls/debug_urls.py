from django.urls import path
from api.views import debug   # 你可以叫 debug.py 或 debug_views.py

urlpatterns = [
    path("content-types/", debug.list_content_types, name="list_content_types"),
]