from rest_framework import viewsets, permissions, decorators, response, status
from django.utils import timezone
import uuid
from .models import File
from .serializers import FileSerializer

class IsOwnerOrAdmin(permissions.BasePermission):             # 1
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or request.user.is_admin

class FileViewSet(viewsets.ModelViewSet):                     # 2
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        qs = File.objects.all()
        if self.request.user.is_admin and "user_id" in self.request.query_params:
            return qs.filter(owner_id=self.request.query_params["user_id"])  # 3
        return qs.filter(owner=self.request.user)                            # 4

    def perform_create(self, serializer):                                     # 5
        fobj = serializer.save(
            owner=self.request.user,
            size=self.request.data["file"].size,
        )
        return fobj

    @decorators.action(detail=True, methods=["post"])                         # 6
    def generate_link(self, request, pk=None):
        file = self.get_object()
        file.public_link = uuid.uuid4()
        file.save()
        return response.Response({"link": str(file.public_link)})

class PublicDownloadView(viewsets.ViewSet):                                   # 7
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, pk=None):
        try:
            file = File.objects.get(public_link=pk)
            file.last_download = timezone.now()
            file.save(update_fields=["last_download"])
            return response.FileResponse(
                file.path.open("rb"), as_attachment=True, filename=file.original_name
            )
        except File.DoesNotExist:
            return response.Response(status=status.HTTP_404_NOT_FOUND)
