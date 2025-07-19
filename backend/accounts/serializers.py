import re
from rest_framework import serializers
from accounts.models import User

USERNAME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9]{3,19}$")

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "full_name", "email", "password")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_username(self, value):
        if not USERNAME_RE.match(value):
            raise serializers.ValidationError(
                "Username must be 4‑20 latin chars, start with letter."
            )
        return value

    def validate_password(self, value):
        if len(value) < 8 or value.isdigit() or value.isalpha():
            raise serializers.ValidationError(
                "Min 8 chars, include letters & digits."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
