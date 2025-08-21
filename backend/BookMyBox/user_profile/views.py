from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import UserProfile
from .serializers import CompleteProfileSerializer, ProfileUpdateSerializer

User = get_user_model()


class UserProfileViewSet(viewsets.ViewSet):
    """
    ViewSet for managing user profiles
    """
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Get the current authenticated user"""
        return self.request.user

    @action(detail=False, methods=['get'], url_path='my-profile')
    def get_my_profile(self, request):
        """
        Get current user's complete profile
        GET /api/user_profile/my-profile/
        """
        user = self.get_object()
        
        # Ensure UserProfile exists
        UserProfile.objects.get_or_create(user=user)
        
        serializer = CompleteProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['patch'], url_path='my-profile/update')
    def update_my_profile(self, request):
        """
        Update current user's profile
        PATCH /api/user_profile/my-profile/update/
        """
        user = self.get_object()
        
        # Ensure UserProfile exists
        UserProfile.objects.get_or_create(user=user)
        
        serializer = ProfileUpdateSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.update(user, serializer.validated_data)
            
            # Return updated profile data
            complete_serializer = CompleteProfileSerializer(updated_user)
            return Response(complete_serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Standard ViewSet methods that delegate to custom actions
    def list(self, request):
        """Maps to get_my_profile"""
        return self.get_my_profile(request)

    def retrieve(self, request, pk=None):
        """Maps to get_my_profile with permission check"""
        if str(pk) != str(request.user.id):
            return Response(
                {"detail": "You can only view your own profile."},
                status=status.HTTP_403_FORBIDDEN
            )
        return self.get_my_profile(request)

    def update(self, request, pk=None):
        """Maps to update_my_profile with permission check"""
        if str(pk) != str(request.user.id):
            return Response(
                {"detail": "You can only update your own profile."},
                status=status.HTTP_403_FORBIDDEN
            )
        return self.update_my_profile(request)

    def partial_update(self, request, pk=None):
        """Maps to update_my_profile with permission check"""
        if str(pk) != str(request.user.id):
            return Response(
                {"detail": "You can only update your own profile."},
                status=status.HTTP_403_FORBIDDEN
            )
        return self.update_my_profile(request)
