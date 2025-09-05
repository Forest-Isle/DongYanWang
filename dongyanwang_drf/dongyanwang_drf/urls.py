"""
URL configuration for dongyanwang_drf project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls.auth_urls')),
    path('api/competition/', include('api.urls.competition_urls')),
    path('api/admissions/', include('api.urls.admissions_urls')),
    path('api/project/', include('api.urls.project_urls')),
    path('api/skill/', include('api.urls.skill_urls')),
    path('api/consultation/', include('api.urls.consultation_urls')),
    path('api/journal/', include('api.urls.journal_urls')),
    path('api/', include('api.urls.admin_urls')),
    path('api/article/', include('api.urls.article_url')),
    path('api/debug/', include('api.urls.debug_urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)