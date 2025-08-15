# owner_dashboard/serializers.py
from rest_framework import serializers
from bookings.models import Booking 
from boxes.models import Box
from boxes.serializers import BoxSerializer # We can reuse the BoxSerializer for listing boxes

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class OwnerDashboardStatsSerializer(serializers.Serializer):
    """
    Defines the shape of the data for the main dashboard overview.
    """
    # Key Metrics
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_bookings = serializers.IntegerField()
    active_boxes_count = serializers.IntegerField()
    pending_boxes_count = serializers.IntegerField()
    rejected_boxes_count = serializers.IntegerField()
    avg_rating = serializers.DecimalField(max_digits=3, decimal_places=1, default=0.0)

    # Chart Data
    sports_distribution = serializers.DictField(child=serializers.IntegerField())
    revenue_chart_labels = serializers.ListField(child=serializers.CharField())
    revenue_chart_data = serializers.ListField(child=serializers.DecimalField(max_digits=10, decimal_places=2))
    bookings_chart_labels = serializers.ListField(child=serializers.CharField())
    bookings_chart_data = serializers.ListField(child=serializers.IntegerField())
    
    # Recent Activity Lists
    recent_bookings = BookingSerializer(many=True)
    all_owner_boxes = BoxSerializer(many=True) # A list of all boxes owned by the user