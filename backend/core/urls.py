from django.urls import path, include
from accounts.views import csrf_view

urlpatterns = [
    path("api/auth/csrf/", csrf_view),           
    path("api/auth/",    include("accounts.urls")),
    path("api/storage/", include("storage.urls")),
]
