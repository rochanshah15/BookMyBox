# dashboard/serializers.py
from rest_framework import serializers
from .models import Achievement, UserBadge, UserGameStats, OwnerGameStats
from boxes.models import Box, UserFavoriteBox

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'icon', 'achievement_type', 'difficulty', 'points']

class UserBadgeSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    earned_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'achievement', 'earned_at']

class UserGameStatsSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='get_level_name', read_only=True)
    
    class Meta:
        model = UserGameStats
        fields = [
            'total_points', 'current_streak', 'longest_streak', 'total_bookings',
            'total_spent', 'favorite_sport', 'level', 'level_name',
            'weekly_bookings', 'monthly_bookings'
        ]

class OwnerGameStatsSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='get_level_name', read_only=True)
    
    class Meta:
        model = OwnerGameStats
        fields = [
            'total_points', 'total_boxes', 'total_bookings_received', 'total_revenue',
            'average_rating', 'level', 'level_name', 'monthly_revenue', 'monthly_bookings'
        ]

class BoxForFavoriteSerializer(serializers.ModelSerializer):
    price_per_hour = serializers.SerializerMethodField()
    class Meta:
        model = Box
        fields = ['id', 'name', 'location', 'price_per_hour', 'description']

    def get_price_per_hour(self, obj):
        return getattr(obj, 'price', None)

class FavoriteBoxSerializer(serializers.ModelSerializer):
    box = BoxForFavoriteSerializer(read_only=True)
    box_id = serializers.PrimaryKeyRelatedField(queryset=Box.objects.all(), source='box', write_only=True, required=False)
    added_on = serializers.DateTimeField(source="added_at", format="%Y-%m-%d", read_only=True)

    class Meta:
        model = UserFavoriteBox
        fields = ['id', 'box', 'box_id', 'added_on']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        box_representation = representation.pop('box', None)
        if box_representation:
            for key in box_representation:
                representation[key] = box_representation[key]
        representation.pop('box_id', None)
        return representation