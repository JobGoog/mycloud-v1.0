from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"
        read_only_fields = (
            "owner", "path", "public_link",
            "uploaded_at", "last_download", "size",
        )
