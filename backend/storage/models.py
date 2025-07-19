import uuid, os
from django.db import models
from django.conf import settings

def upload_path(instance, filename):                      # 1
    # MEDIA_ROOT/<user_uuid>/<random hex>
    return os.path.join(instance.owner.storage_path, f"{uuid.uuid4().hex}")

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # 2
    original_name = models.CharField(max_length=255)
    size = models.PositiveBigIntegerField()               # 3
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_download = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    path = models.FileField(upload_to=upload_path)        # 4
    public_link = models.UUIDField(null=True, blank=True) # 5

    def __str__(self):
        return self.original_name
