# dashboard/urls.py

from django.urls import path
from .views import (
    DashboardAnalyticsView, DashboardAchievementsView, DashboardFavoritesView, 
    RemoveFavoriteView, UserGameStatsView, OwnerGameStatsView
)

urlpatterns = [
    path('analytics/', DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
    path('achievements/', DashboardAchievementsView.as_view(), name='dashboard-achievements'),
    path('favorites/', DashboardFavoritesView.as_view(), name='dashboard-favorites'),
    path('favorites/<int:box_id>/remove/', RemoveFavoriteView.as_view(), name='remove-favorite'),
    path('user-stats/', UserGameStatsView.as_view(), name='user-game-stats'),
    path('owner-stats/', OwnerGameStatsView.as_view(), name='owner-game-stats'),
]