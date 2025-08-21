from django.db.models.signals import post_save
from django.dispatch import receiver
from bookings.models import Booking
from boxes.models import Box
from .gamification import trigger_gamification_check

@receiver(post_save, sender=Booking)
def booking_created_gamification(sender, instance, created, **kwargs):
    """Trigger gamification check when a booking is created or updated"""
    if instance.booking_status == 'Confirmed':
        # Check badges for the user who made the booking
        trigger_gamification_check(instance.user, 'user')
        
        # Check badges for the owner of the box
        if instance.box and instance.box.owner:
            trigger_gamification_check(instance.box.owner, 'owner')

@receiver(post_save, sender=Box)
def box_approved_gamification(sender, instance, created, **kwargs):
    """Trigger gamification check when a box is approved"""
    if instance.status == 'approved' and instance.owner:
        trigger_gamification_check(instance.owner, 'owner')
