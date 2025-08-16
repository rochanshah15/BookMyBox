# bookings/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import transaction
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta, time, date
from django.conf import settings

from .models import Booking
from .serializers import BookingSerializer
from boxes.models import Box 

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can manage their bookings

    def get_queryset(self):
        # Users can only see their own bookings
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Get data from frontend
        box_id = request.data.get('boxId')
        date_str = request.data.get('date') # Format 'YYYY-MM-DD'
        start_time_str = request.data.get('startTime') # Format 'HH:MM'
        duration_hours = request.data.get('duration') # Integer
        # payment_id is no longer needed as we're removing Stripe for now
        # payment_id = request.data.get('paymentId') 

        # Removed paymentId from validation
        if not all([box_id, date_str, start_time_str, duration_hours]):
            raise ValidationError("Missing required booking details (boxId, date, startTime, duration).")

        try:
            duration_hours = int(duration_hours)
            if not (1 <= duration_hours <= 6): # Frontend allows 1-6 hours
                raise ValidationError("Duration must be between 1 and 6 hours.")
        except (ValueError, TypeError):
            raise ValidationError("Invalid duration format.")

        try:
            box = get_object_or_404(Box, pk=box_id)
        except Exception:
            raise ValidationError("Box not found.")

        # Calculate end_time
        try:
            start_hour = int(start_time_str.split(':')[0])
            start_minute = int(start_time_str.split(':')[1]) 
            
            start_datetime = datetime.combine(datetime.strptime(date_str, '%Y-%m-%d').date(), time(start_hour, start_minute))
            
            end_datetime = start_datetime + timedelta(hours=duration_hours)
            
            if end_datetime.hour > 23 or (end_datetime.hour == 23 and end_datetime.minute > 0): 
                raise ValidationError("Booking cannot extend past 23:00.")
            
            end_time_str = end_datetime.strftime("%H:%M") 
        except (ValueError, IndexError):
            raise ValidationError("Invalid start time or date format.")

        # Calculate total amount server-side for security (still important)
        expected_total_amount = box.price * duration_hours

        # Check for time slot availability
        if Booking.objects.filter(
            box=box, 
            date=date_str, 
            start_time=start_time_str, 
            booking_status='Confirmed'
        ).exists():
            raise ValidationError("This time slot is already booked for this box.")

        # --- Manual Booking Confirmation (Stripe removed) ---
        # Payment status is now 'Pending' or 'Not Required' as no real payment is processed
        payment_status = 'Pending' 
        actual_payment_id = None # No Stripe PaymentIntent ID to store

        with transaction.atomic():
            booking = Booking.objects.create(
                user=request.user,
                box=box,
                date=date_str,
                start_time=start_time_str,
                end_time=end_time_str,
                duration=duration_hours,
                total_amount=expected_total_amount,
                payment_status=payment_status, # Set to 'Pending' or similar
                payment_id=actual_payment_id, 
                booking_status='Confirmed' # Or 'Pending' if you want a manual admin approval
            )
            serializer = self.get_serializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        
        if booking.user != request.user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to cancel this booking.'}, status=status.HTTP_403_FORBIDDEN)

        # Timezone aware checks (retained as they are good practice)
        if settings.USE_TZ:
            import pytz
            tz = pytz.timezone(settings.TIME_ZONE)
            booking_dt = tz.localize(datetime.combine(booking.date, time.fromisoformat(booking.start_time)))
            now = datetime.now(tz)
        else:
            booking_dt = datetime.combine(booking.date, time.fromisoformat(booking.start_time))
            now = datetime.now()


        if now > booking_dt - timedelta(hours=2):
            return Response({'detail': 'Cancellation not allowed within 2 hours of booking time.'}, status=status.HTTP_400_BAD_REQUEST)

        if booking.booking_status == 'Cancelled':
            return Response({'detail': 'Booking already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        # Removed Stripe refund logic
        print(f"Booking {booking.id} cancelled manually. No Stripe refund attempted.")

        booking.booking_status = 'Cancelled'
        booking.save()
        serializer = self.get_serializer(booking) 
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[])
    def booked_slots(self, request):
        """
        Get booked time slots for a specific box and date
        Query params: box_id, date (YYYY-MM-DD format)
        """
        box_id = request.query_params.get('box_id')
        date_str = request.query_params.get('date')
        
        if not box_id or not date_str:
            return Response({
                'error': 'box_id and date parameters are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Validate date format
            datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            return Response({
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            box = Box.objects.get(pk=box_id)
        except Box.DoesNotExist:
            return Response({
                'error': 'Box not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get all confirmed bookings for this box and date
        bookings = Booking.objects.filter(
            box=box,
            date=date_str,
            booking_status='Confirmed'
        ).values('start_time', 'end_time', 'duration')
        
        # Convert to list of booked time slots
        booked_slots = []
        for booking in bookings:
            start_time = booking['start_time']
            duration = booking['duration']
            
            # Generate all time slots covered by this booking
            start_hour = int(start_time.split(':')[0])
            start_minute = int(start_time.split(':')[1])
            
            for i in range(duration):
                slot_hour = start_hour + i
                if slot_hour < 24:  # Don't go past midnight
                    slot_time = f"{slot_hour:02d}:{start_minute:02d}"
                    booked_slots.append(slot_time)
        
        return Response({
            'box_id': box_id,
            'date': date_str,
            'booked_slots': booked_slots
        }, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['destroy']:
            self.permission_classes = [IsAdminUser]
        else: 
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()