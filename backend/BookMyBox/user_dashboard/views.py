# dashboard/views.py

from django.db.models import Sum, Count, F, Q, Case, When, FloatField
from django.db.models.functions import TruncMonth, ExtractWeekDay
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from collections import defaultdict

from bookings.models import Booking
from boxes.models import Box, UserFavoriteBox
from .models import Achievement, UserBadge, UserGameStats, OwnerGameStats
from user_profile.models import UserProfile
from .serializers import (
    AchievementSerializer, FavoriteBoxSerializer, UserBadgeSerializer,
    UserGameStatsSerializer, OwnerGameStatsSerializer
)
from .gamification import trigger_gamification_check

class DashboardAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Base querysets for the user's bookings
        all_bookings = Booking.objects.filter(user=user)
        confirmed_bookings = all_bookings.filter(booking_status='Confirmed')

        # --- Calculate Stats ---
        total_spent = confirmed_bookings.aggregate(total=Sum('total_amount'))['total'] or 0
        total_hours_played = confirmed_bookings.aggregate(total=Sum('duration'))['total'] or 0
        total_bookings_count = all_bookings.count()
        cancelled_bookings_count = all_bookings.filter(booking_status='Cancelled').count()

        cancellation_rate = (cancelled_bookings_count / total_bookings_count * 100) if total_bookings_count > 0 else 0
        
        # This month's bookings
        now = datetime.now()
        this_month_bookings = confirmed_bookings.filter(date__year=now.year, date__month=now.month).count()
        
        # Average cost per session
        avg_cost_per_session = (total_spent / confirmed_bookings.count()) if confirmed_bookings.count() > 0 else 0

        # --- Sport Distribution (for Doughnut Chart) ---
        sport_distribution_data = confirmed_bookings.values('box__sport').annotate(count=Count('id')).order_by('-count')
        total_confirmed_count = confirmed_bookings.count()
        sport_distribution = [
            {'sport': item['box__sport'], 'percentage': (item['count'] / total_confirmed_count * 100) if total_confirmed_count > 0 else 0}
            for item in sport_distribution_data
        ]

        # --- Monthly Spending (for Line Chart) ---
        monthly_spending_data = confirmed_bookings.annotate(month=TruncMonth('date')).values('month').annotate(total_spent=Sum('total_amount')).order_by('month')
        monthly_spending = [
            {'month': item['month'].strftime('%b %Y'), 'total_spent': item['total_spent']}
            for item in monthly_spending_data
        ]

        # --- Activity by Day of Week (for Bar Chart) ---
        # Note: Django's ExtractWeekDay: 1=Sun, 2=Mon, ..., 7=Sat
        days_of_week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        activity_by_day_data = confirmed_bookings.annotate(
            day_of_week=ExtractWeekDay('date')
        ).values('day_of_week').annotate(total_hours=Sum('duration')).order_by('day_of_week')

        # Map integer to day name
        activity_by_day = [
            {'day_of_week': days_of_week[item['day_of_week'] - 1], 'total_hours': item['total_hours']}
            for item in activity_by_day_data
        ]
        
        # --- Peak Booking Hours ---
        peak_hours_data = defaultdict(int)
        for booking in confirmed_bookings:
            hour_range = f"{booking.start_time[:2]}:00 - {booking.end_time[:2]}:00"
            peak_hours_data[hour_range] += 1
        
        peak_booking_hours = [
            {'hour_range': hr, 'percentage': (count / total_confirmed_count * 100) if total_confirmed_count > 0 else 0}
            for hr, count in sorted(peak_hours_data.items(), key=lambda item: item[1], reverse=True)[:3] # Top 3
        ]

        # Assemble the final data object
        data = {
            'total_spent': total_spent,
            'this_month_bookings': this_month_bookings,
            'total_hours_played': total_hours_played,
            'average_rating': 4.5, # Placeholder - you'd calculate this from a Reviews model
            'average_cost_per_session': avg_cost_per_session,
            'cancellation_rate': cancellation_rate,
            'sport_distribution': sport_distribution,
            'monthly_spending': monthly_spending,
            'activity_by_day': activity_by_day,
            'peak_booking_hours': peak_booking_hours,
        }

        return Response(data)


class DashboardFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        favorites = UserFavoriteBox.objects.filter(user=user)
        serializer = FavoriteBoxSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        box_id = request.data.get('box_id')
        if not box_id:
            return Response({'error': 'box_id is required'}, status=400)
        # Check if already favorited
        favorite, created = UserFavoriteBox.objects.get_or_create(user=user, box_id=box_id)
        serializer = FavoriteBoxSerializer(favorite)
        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=200)

    def delete(self, request, *args, **kwargs):
        user = request.user
        box_id = request.data.get('box_id')
        if not box_id:
            return Response({'error': 'box_id is required'}, status=400)
        
        try:
            favorite = UserFavoriteBox.objects.get(user=user, box_id=box_id)
            favorite.delete()
            return Response({'message': 'Favorite removed successfully'}, status=200)
        except UserFavoriteBox.DoesNotExist:
            return Response({'error': 'Favorite not found'}, status=404)


class RemoveFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, box_id, *args, **kwargs):
        user = request.user
        
        try:
            favorite = UserFavoriteBox.objects.get(user=user, box_id=box_id)
            favorite.delete()
            return Response({'message': 'Favorite removed successfully'}, status=200)
        except UserFavoriteBox.DoesNotExist:
            return Response({'error': 'Favorite not found'}, status=404)


class DashboardAchievementsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Trigger gamification check based on user type
        user_type = 'owner' if hasattr(user, 'owner_stats') or Box.objects.filter(owner=user).exists() else 'user'
        newly_earned = trigger_gamification_check(user, user_type)
        
        # Get user's earned badges
        user_badges = UserBadge.objects.filter(user=user).select_related('achievement')
        earned_achievements = {badge.achievement.id for badge in user_badges}
        
        # Get all achievements relevant to user type
        if user_type == 'owner':
            all_achievements = Achievement.objects.filter(achievement_type__in=['owner', 'both'], is_active=True)
        else:
            all_achievements = Achievement.objects.filter(achievement_type__in=['user', 'both'], is_active=True)

        # Prepare response
        result = []
        for ach in all_achievements:
            data = AchievementSerializer(ach).data
            data['earned'] = ach.id in earned_achievements
            data['newly_earned'] = ach in newly_earned
            result.append(data)
        
        return Response(result)

class UserGameStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Trigger gamification check
        trigger_gamification_check(user, 'user')
        
        # Get or create user game stats
        user_stats, created = UserGameStats.objects.get_or_create(user=user)
        
        # Get user badges
        user_badges = UserBadge.objects.filter(user=user).select_related('achievement').order_by('-earned_at')
        
        return Response({
            'stats': UserGameStatsSerializer(user_stats).data,
            'badges': UserBadgeSerializer(user_badges, many=True).data,
            'total_badges': user_badges.count()
        })

class OwnerGameStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Trigger gamification check
        trigger_gamification_check(user, 'owner')
        
        # Get or create owner game stats
        owner_stats, created = OwnerGameStats.objects.get_or_create(user=user)
        
        # Get user badges (achievements for owners)
        user_badges = UserBadge.objects.filter(user=user).select_related('achievement').order_by('-earned_at')
        
        return Response({
            'stats': OwnerGameStatsSerializer(owner_stats).data,
            'badges': UserBadgeSerializer(user_badges, many=True).data,
            'total_badges': user_badges.count()
        })