"""
Gamification service for BookMyBox
Handles badge checking and awarding for users and owners
"""

from django.db.models import Count, Sum
from datetime import datetime, timedelta
from .models import Achievement, UserBadge, UserGameStats, OwnerGameStats
from bookings.models import Booking
from boxes.models import Box

class GamificationService:
    
    @staticmethod
    def check_and_award_user_badges(user):
        """Check and award badges for user activities"""
        awarded_badges = []
        
        # Get or create user game stats
        user_stats, created = UserGameStats.objects.get_or_create(user=user)
        
        # Get user's bookings
        user_bookings = Booking.objects.filter(user=user, booking_status='Confirmed')
        total_bookings = user_bookings.count()
        
        # Update basic stats
        user_stats.total_bookings = total_bookings
        user_stats.total_spent = user_bookings.aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Check weekly bookings (last 7 days)
        week_ago = datetime.now().date() - timedelta(days=7)
        weekly_bookings = user_bookings.filter(date__gte=week_ago).count()
        user_stats.weekly_bookings = weekly_bookings
        
        # Check monthly bookings (last 30 days)
        month_ago = datetime.now().date() - timedelta(days=30)
        monthly_bookings = user_bookings.filter(date__gte=month_ago).count()
        user_stats.monthly_bookings = monthly_bookings
        
        # Badge: Weekly Warrior (3+ bookings in a week)
        if weekly_bookings >= 3:
            awarded_badges.extend(GamificationService._award_badge(user, 'Weekly Warrior'))
        
        # Badge: First Timer (first booking)
        if total_bookings >= 1:
            awarded_badges.extend(GamificationService._award_badge(user, 'First Timer'))
        
        # Badge: Regular Player (10+ bookings)
        if total_bookings >= 10:
            awarded_badges.extend(GamificationService._award_badge(user, 'Regular Player'))
        
        # Badge: Sports Enthusiast (25+ bookings)
        if total_bookings >= 25:
            awarded_badges.extend(GamificationService._award_badge(user, 'Sports Enthusiast'))
        
        # Badge: Big Spender (₹5000+ total spent)
        if user_stats.total_spent >= 5000:
            awarded_badges.extend(GamificationService._award_badge(user, 'Big Spender'))
        
        # Badge: Monthly Champion (10+ bookings in a month)
        if monthly_bookings >= 10:
            awarded_badges.extend(GamificationService._award_badge(user, 'Monthly Champion'))
        
        # Update points based on bookings
        user_stats.total_points = total_bookings * 10 + len(UserBadge.objects.filter(user=user)) * 50
        user_stats.update_level()
        user_stats.save()
        
        return awarded_badges
    
    @staticmethod
    def check_and_award_owner_badges(user):
        """Check and award badges for owner activities"""
        awarded_badges = []
        
        # Get or create owner game stats
        owner_stats, created = OwnerGameStats.objects.get_or_create(user=user)
        
        # Get owner's boxes and related bookings
        owner_boxes = Box.objects.filter(owner=user, status='approved')
        total_boxes = owner_boxes.count()
        
        # Get all bookings for owner's boxes
        box_bookings = Booking.objects.filter(box__in=owner_boxes, booking_status='Confirmed')
        total_bookings_received = box_bookings.count()
        total_revenue = box_bookings.aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Update basic stats
        owner_stats.total_boxes = total_boxes
        owner_stats.total_bookings_received = total_bookings_received
        owner_stats.total_revenue = total_revenue
        
        # Check monthly stats
        month_ago = datetime.now().date() - timedelta(days=30)
        monthly_bookings = box_bookings.filter(date__gte=month_ago).count()
        monthly_revenue = box_bookings.filter(date__gte=month_ago).aggregate(total=Sum('total_amount'))['total'] or 0
        
        owner_stats.monthly_bookings = monthly_bookings
        owner_stats.monthly_revenue = monthly_revenue
        
        # Badge: New Business (first box approved)
        if total_boxes >= 1:
            awarded_badges.extend(GamificationService._award_badge(user, 'New Business'))
        
        # Badge: Entrepreneur (3+ boxes)
        if total_boxes >= 3:
            awarded_badges.extend(GamificationService._award_badge(user, 'Entrepreneur'))
        
        # Badge: Popular Venue (50+ bookings received)
        if total_bookings_received >= 50:
            awarded_badges.extend(GamificationService._award_badge(user, 'Popular Venue'))
        
        # Badge: Revenue Milestone (₹25000+ total revenue)
        if total_revenue >= 25000:
            awarded_badges.extend(GamificationService._award_badge(user, 'Revenue Milestone'))
        
        # Badge: Monthly Success (20+ bookings in a month)
        if monthly_bookings >= 20:
            awarded_badges.extend(GamificationService._award_badge(user, 'Monthly Success'))
        
        # Update points based on performance
        owner_stats.total_points = (total_boxes * 100 + 
                                  total_bookings_received * 5 + 
                                  int(total_revenue / 100) + 
                                  len(UserBadge.objects.filter(user=user)) * 100)
        owner_stats.update_level()
        owner_stats.save()
        
        return awarded_badges
    
    @staticmethod
    def _award_badge(user, badge_name):
        """Award a specific badge to user if not already earned"""
        try:
            achievement = Achievement.objects.get(name=badge_name, is_active=True)
            badge, created = UserBadge.objects.get_or_create(user=user, achievement=achievement)
            if created:
                return [achievement]
        except Achievement.DoesNotExist:
            pass
        return []
    
    @staticmethod
    def create_default_achievements():
        """Create default achievements if they don't exist"""
        user_achievements = [
            {
                'name': 'First Timer',
                'description': 'Completed your first booking!',
                'icon': 'PlayCircle',
                'achievement_type': 'user',
                'difficulty': 'bronze',
                'points': 50
            },
            {
                'name': 'Weekly Warrior',
                'description': 'Made 3 or more bookings in a week!',
                'icon': 'Zap',
                'achievement_type': 'user',
                'difficulty': 'silver',
                'points': 100
            },
            {
                'name': 'Regular Player',
                'description': 'Completed 10 bookings!',
                'icon': 'Target',
                'achievement_type': 'user',
                'difficulty': 'silver',
                'points': 150
            },
            {
                'name': 'Sports Enthusiast',
                'description': 'Completed 25 bookings!',
                'icon': 'Trophy',
                'achievement_type': 'user',
                'difficulty': 'gold',
                'points': 250
            },
            {
                'name': 'Big Spender',
                'description': 'Spent ₹5000+ on bookings!',
                'icon': 'DollarSign',
                'achievement_type': 'user',
                'difficulty': 'gold',
                'points': 200
            },
            {
                'name': 'Monthly Champion',
                'description': 'Made 10+ bookings in a month!',
                'icon': 'Crown',
                'achievement_type': 'user',
                'difficulty': 'diamond',
                'points': 300
            }
        ]
        
        owner_achievements = [
            {
                'name': 'New Business',
                'description': 'Got your first box approved!',
                'icon': 'Building',
                'achievement_type': 'owner',
                'difficulty': 'bronze',
                'points': 100
            },
            {
                'name': 'Entrepreneur',
                'description': 'Have 3 or more approved boxes!',
                'icon': 'TrendingUp',
                'achievement_type': 'owner',
                'difficulty': 'silver',
                'points': 200
            },
            {
                'name': 'Popular Venue',
                'description': 'Received 50+ bookings!',
                'icon': 'Users',
                'achievement_type': 'owner',
                'difficulty': 'gold',
                'points': 300
            },
            {
                'name': 'Revenue Milestone',
                'description': 'Earned ₹25,000+ in total revenue!',
                'icon': 'Award',
                'achievement_type': 'owner',
                'difficulty': 'gold',
                'points': 400
            },
            {
                'name': 'Monthly Success',
                'description': 'Received 20+ bookings in a month!',
                'icon': 'Star',
                'achievement_type': 'owner',
                'difficulty': 'diamond',
                'points': 500
            }
        ]
        
        all_achievements = user_achievements + owner_achievements
        
        for ach_data in all_achievements:
            achievement, created = Achievement.objects.get_or_create(
                name=ach_data['name'],
                defaults=ach_data
            )
            if created:
                print(f"Created achievement: {achievement.name}")

def trigger_gamification_check(user, user_type='user'):
    """Trigger gamification check for a user"""
    if user_type == 'user':
        return GamificationService.check_and_award_user_badges(user)
    elif user_type == 'owner':
        return GamificationService.check_and_award_owner_badges(user)
    return []
