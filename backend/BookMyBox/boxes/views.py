# boxes/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters as drf_filters
from django.db import models
from django.utils import timezone
import math

from .models import Box, Review
from .serializers import BoxSerializer, ReviewSerializer, OwnerBoxSerializer
from .filters import BoxFilter


class MinLengthSearchFilter(drf_filters.SearchFilter):
    """Custom search filter that handles searches of any length"""
    
    def filter_queryset(self, request, queryset, view):
        search_terms = self.get_search_terms(request)
        if not search_terms:
            return queryset
        
        # Join all search terms and check length
        search_string = ' '.join(search_terms).strip()
        if not search_string:
            return queryset
            
        # Allow searches of any length - remove the 2 character restriction
        return super().filter_queryset(request, queryset, view)

# Haversine function remains the same
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    lat1_rad, lon1_rad, lat2_rad, lon2_rad = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class PublicBoxViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset provides PUBLIC read-only access to approved boxes.
    It handles listing, retrieving, searching, and nearby functionality.
    """
    queryset = Box.objects.filter(status='approved').order_by('id')
    serializer_class = BoxSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, MinLengthSearchFilter, drf_filters.OrderingFilter]
    filterset_class = BoxFilter
    search_fields = ['name']  # Only search by name field
    ordering_fields = ['price', 'rating', 'name', 'id']
    ordering = ['id']  # Default ordering
    
    def get_queryset(self):
        """Ensure we always return only approved boxes with stable ordering"""
        return Box.objects.filter(status='approved').order_by('id')

    # --- ADDED THE TWO MISSING ACTIONS BELOW ---

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        This new function creates the /api/boxes/featured/ URL.
        It returns a list of approved boxes that are marked as featured.
        """
        # NOTE: This code assumes your Box model has a field named 'is_featured'.
        # If your field is named differently, please change the filter below.
        # For example, if it's called 'is_premium', change to .filter(is_premium=True)
        featured_boxes = self.get_queryset().filter(is_featured=True)
        
        serializer = self.get_serializer(featured_boxes, many=True)
        print("featured:", serializer.data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """
        This new function creates the /api/boxes/popular/ URL.
        It returns a list of the most popular approved boxes.
        """
        # NOTE: This is an example of getting popular boxes by ordering by rating.
        # You can change this logic to define 'popular' however you like.
        popular_boxes = self.get_queryset().order_by('-rating')[:10] # Gets top 10 by rating
        
        serializer = self.get_serializer(popular_boxes, many=True)
        
        return Response(serializer.data)

    # --- YOUR EXISTING ACTIONS ARE UNCHANGED ---

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        # ... (your existing nearby logic is unchanged)
        lat_str = request.query_params.get('lat')
        lng_str = request.query_params.get('lng')
        radius_str = request.query_params.get('radius', 20)
        if not lat_str or not lng_str:
            return Response({"error": "Latitude (lat) and Longitude (lng) are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_lat, user_lng, search_radius = map(float, [lat_str, lng_str, radius_str])
        except ValueError:
            return Response({"error": "lat, lng, and radius must be valid numbers."}, status=status.HTTP_400_BAD_REQUEST)
        
        all_approved_boxes = self.get_queryset()
        nearby_boxes_list = []
        for box in all_approved_boxes:
            if box.latitude is not None and box.longitude is not None:
                distance = haversine_distance(user_lat, user_lng, float(box.latitude), float(box.longitude))
                if distance <= search_radius:
                    box.distance_from_user = distance
                    nearby_boxes_list.append(box)
        
        nearby_boxes_list.sort(key=lambda b: b.distance_from_user)
        serializer = self.get_serializer(nearby_boxes_list, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, pk=None):
        # ... (your existing add_review logic is unchanged)
        box = self.get_object()
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(box=box, user=request.user)
            new_avg = box.reviews.aggregate(models.Avg('rating'))['rating__avg']
            box.rating = new_avg or 0.0
            box.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OwnerBoxViewSet(viewsets.ModelViewSet):
    """
    This viewset allows authenticated users (owners) to CREATE,
    LIST, UPDATE, and DELETE their own boxes.
    """
    serializer_class = OwnerBoxSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This is the key: it filters the boxes to only those
        owned by the currently authenticated user.
        """
        return Box.objects.filter(owner=self.request.user).order_by('-submitted_at')

    def perform_create(self, serializer):
        box = serializer.save(
            owner=self.request.user,
            status='pending',  # New boxes start as pending and require admin approval
            submitted_at=timezone.now()
        )
        images = self.request.FILES.getlist('images')
        # Always ensure box.images is a list
        if not isinstance(box.images, list):
            box.images = []
        if images:
            for img in images:
                if hasattr(img, 'name'):
                    box.images.append(img.name)
            # Set main image as first
            box.image = images[0]
        box.save()