import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, username, full_name, email, password=None, **extra):
        if not username:
            raise ValueError("Username required")          
        email = self.normalize_email(email)                
        user = self.model(username=username, full_name=full_name,
                          email=email, **extra)            
        user.set_password(password)                        
        user.save()                                        
        return user

    def create_superuser(self, username, full_name, email, password):
        return self.create_user(username, full_name, email, password,
                                is_admin=True, is_staff=True, is_superuser=True)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)   
    is_active = models.BooleanField(default=True)   
    is_admin = models.BooleanField(default=False)  
    storage_path = models.CharField(max_length=255, default="", blank=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["full_name", "email"]

    objects = UserManager()


    def __str__(self):
        return self.username
