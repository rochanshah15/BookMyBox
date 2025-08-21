from django.db import models
from django.conf import settings
from datetime import datetime, timedelta

class Achievement(models.Model):
    ACHIEVEMENT_TYPES = (
        ('user', 'User Achievement'),
        ('owner', 'Owner Achievement'),
        ('both', 'Both'),
    )
    
    DIFFICULTY_LEVELS = (
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('diamond', 'Diamond'),
    )
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, null=True) # e.g., 'Trophy', 'Star' for icon name
    achievement_type = models.CharField(max_length=10, choices=ACHIEVEMENT_TYPES, default='user')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS, default='bronze')
    points = models.IntegerField(default=10)  # Points awarded for this achievement
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.difficulty.title()})"

class UserBadge(models.Model):
    """Track when users earn badges with timestamps"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'achievement')
    
    def __str__(self):
        return f"{self.user.email} - {self.achievement.name}"

class UserGameStats(models.Model):
    """Track user statistics for gamification"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='game_stats')
    total_points = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)  # Current booking streak
    longest_streak = models.IntegerField(default=0)  # Longest booking streak
    total_bookings = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    favorite_sport = models.CharField(max_length=50, blank=True, null=True)
    level = models.IntegerField(default=1)
    
    # Weekly/Monthly stats
    weekly_bookings = models.IntegerField(default=0)
    monthly_bookings = models.IntegerField(default=0)
    last_booking_date = models.DateField(blank=True, null=True)
    
    def update_level(self):
        """Update user level based on total points"""
        if self.total_points >= 1000:
            self.level = 5  # Champion
        elif self.total_points >= 500:
            self.level = 4  # Expert
        elif self.total_points >= 200:
            self.level = 3  # Advanced
        elif self.total_points >= 50:
            self.level = 2  # Intermediate
        else:
            self.level = 1  # Beginner
    
    def get_level_name(self):
        levels = {1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert', 5: 'Champion'}
        return levels.get(self.level, 'Beginner')
    
    def __str__(self):
        return f"{self.user.email} - Level {self.level} ({self.total_points} points)"

class OwnerGameStats(models.Model):
    """Track owner statistics for gamification"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owner_stats')
    total_points = models.IntegerField(default=0)
    total_boxes = models.IntegerField(default=0)
    total_bookings_received = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    level = models.IntegerField(default=1)
    
    # Monthly stats
    monthly_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monthly_bookings = models.IntegerField(default=0)
    
    def update_level(self):
        """Update owner level based on total points"""
        if self.total_points >= 2000:
            self.level = 5  # Elite Business
        elif self.total_points >= 1000:
            self.level = 4  # Professional
        elif self.total_points >= 500:
            self.level = 3  # Established
        elif self.total_points >= 100:
            self.level = 2  # Growing
        else:
            self.level = 1  # Starter
    
    def get_level_name(self):
        levels = {1: 'Starter', 2: 'Growing', 3: 'Established', 4: 'Professional', 5: 'Elite Business'}
        return levels.get(self.level, 'Starter')
    
    def __str__(self):
        return f"{self.user.email} - Level {self.level} ({self.total_points} points)"

# Link achievements to user profile via ManyToManyField  
from user_profile.models import UserProfile
UserProfile.add_to_class('achievements', models.ManyToManyField(Achievement, blank=True))