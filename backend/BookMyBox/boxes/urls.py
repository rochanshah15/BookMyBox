# boxes/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicBoxViewSet, OwnerBoxViewSet

# Router for the public-facing API (listing, searching boxes)
public_router = DefaultRouter()
public_router.register(r'', PublicBoxViewSet, basename='public-box')

# Router for the owner-specific API (creating, managing their own boxes)
owner_router = DefaultRouter()
owner_router.register(r'owner', OwnerBoxViewSet, basename='owner-box')

# Combine the urls
# This will create:
# /api/boxes/ -> for public viewing (since main urls.py has path('api/boxes/', include('boxes.urls')))
# /api/boxes/owner/ -> for owner management
urlpatterns = [
    path('', include(public_router.urls)),
    path('', include(owner_router.urls)),
]