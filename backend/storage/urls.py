from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, PublicDownloadView

router = DefaultRouter()
router.register(r"files", FileViewSet, basename="file")

urlpatterns = [
    path("", include(router.urls)),
    path("public/<uuid:pk>/", PublicDownloadView.as_view({"get": "retrieve"})),
]
