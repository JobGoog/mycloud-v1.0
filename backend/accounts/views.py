from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout

from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from accounts.serializers import SignUpSerializer

@ensure_csrf_cookie              # ← ставит куку при GET
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])      # без SessionAuth
def csrf_view(request):
    return Response({"detail": "ok"})



# ---------- /api/auth/signup/ ----------
class SignupView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerializer

# ---------- /api/auth/login/ ----------
class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SignUpSerializer

    def post(self, request):
        user = authenticate(
            username=request.data.get("username"),
            password=request.data.get("password"),
        )
        if user:
            login(request, user)
            return Response({"detail": "ok"})
        return Response({"detail": "invalid credentials"},
                        status=status.HTTP_401_UNAUTHORIZED)

# ---------- /api/auth/logout/ ----------
class LogoutView(generics.GenericAPIView):
    def post(self, request):
        logout(request)
        return Response({"detail": "bye"})
