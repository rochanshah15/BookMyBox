from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile
User = get_user_model()
class CompleteProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)
    location = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    business_name = serializers.CharField(read_only=True)
    is_verified = serializers.BooleanField(read_only=True)
    date_of_birth = serializers.DateField(read_only=True, allow_null=True)
    bio = serializers.CharField(read_only=True)
    preferred_sports = serializers.ListField(child=serializers.CharField(), read_only=True)
    emergency_contact = serializers.CharField(read_only=True)
    address = serializers.CharField(read_only=True)
    def to_representation(self, user):
        profile, created = UserProfile.objects.get_or_create(user=user)
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "phone": user.phone or "",
            "location": user.location or "",
            "role": user.role,
            "business_name": user.business_name or "",
            "is_verified": user.is_verified,
            "date_of_birth": profile.date_of_birth,
            "bio": profile.bio or "",
            "preferred_sports": profile.preferred_sports or [],
            "emergency_contact": profile.emergency_contact or "",
            "address": profile.address or "",
        }
class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=10)
    location = serializers.CharField(required=False, allow_blank=True, max_length=255)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    preferred_sports = serializers.ListField(child=serializers.CharField(max_length=50), required=False, allow_empty=True)
    emergency_contact = serializers.CharField(required=False, allow_blank=True, max_length=20)
    address = serializers.CharField(required=False, allow_blank=True)
    def update(self, user, validated_data):
        user_fields = ["first_name", "last_name", "phone", "location"]
        for field in user_fields:
            if field in validated_data:
                setattr(user, field, validated_data[field])
        user.save()
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile_fields = ["date_of_birth", "bio", "preferred_sports", "emergency_contact", "address"]
        for field in profile_fields:
            if field in validated_data:
                setattr(profile, field, validated_data[field])
        profile.save()
        return user
