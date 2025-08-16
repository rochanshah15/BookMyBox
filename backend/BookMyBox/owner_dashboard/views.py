# owner_dashboard/views.py

from collections import defaultdict
from datetime import timedelta

from django.db import models
from django.db.models import Avg, Count, DecimalField, FloatField, Q, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from boxes.models import Box

from .serializers import OwnerDashboardStatsSerializer, BoxSerializer, BookingSerializer


class OwnerDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        all_owner_boxes = Box.objects.filter(owner=user).order_by("-submitted_at")
        approved_boxes = all_owner_boxes.filter(status="approved")
        pending_boxes = all_owner_boxes.filter(status="pending")
        rejected_boxes = all_owner_boxes.filter(status="rejected")

        # Key Metrics
        stats = approved_boxes.aggregate(
            total_revenue=Coalesce(
                Sum("bookings__total_amount", filter=Q(bookings__booking_status="completed")),
                0.0,
                output_field=DecimalField(),
            ),
            total_bookings=Coalesce(Count("bookings"), 0),
            avg_rating=Coalesce(Avg("reviews__rating"), 0.0, output_field=DecimalField()),
        )

        # Chart Data
        sports_count = defaultdict(int)
        for box in all_owner_boxes:
            if hasattr(box, 'sports') and isinstance(box.sports, list):
                for sport in box.sports:
                    sports_count[sport] += 1
            elif hasattr(box, 'sport') and box.sport:
                sports_count[box.sport] += 1

        today = timezone.now().date()
        revenue_chart_labels = []
        revenue_chart_data = []
        for i in range(5, -1, -1):
            month_start = (today.replace(day=1) - timedelta(days=i * 30)).replace(day=1)
            revenue_chart_labels.append(month_start.strftime("%b"))
            monthly_revenue = (
                Booking.objects.filter(
                    box__in=approved_boxes,
                    date__month=month_start.month,
                    date__year=month_start.year,
                    booking_status="completed",
                ).aggregate(total=Coalesce(Sum("total_amount"), 0.0, output_field=DecimalField()))["total"]
            )
            revenue_chart_data.append(monthly_revenue)

        # Bookings chart (dummy data for now)
        bookings_chart_labels = revenue_chart_labels
        bookings_chart_data = [
            Booking.objects.filter(
                box__in=approved_boxes,
                date__month=timezone.now().month - i,
                booking_status="completed",
            ).count() for i in range(6)
        ]

        # Recent Bookings
        recent_bookings_qs = (
            Booking.objects.filter(box__in=all_owner_boxes)
            .select_related("user", "box")
            .order_by("-date", "-start_time")[:5]
        )
        recent_bookings_data = [
            {
                "id": b.id,
                "user_name": getattr(b.user, "name", getattr(b.user, "email", "N/A")),
                "box_name": getattr(b.box, "name", "N/A"),
                "date": b.date,
                "amount": b.total_amount,
                "status": b.booking_status,
                "time_slot": f"{b.start_time if isinstance(b.start_time, str) else b.start_time.strftime('%H:%M')} - {b.end_time if isinstance(b.end_time, str) else b.end_time.strftime('%H:%M')}"
            }
            for b in recent_bookings_qs
        ]

        # Pass raw queryset to serializer, let it handle serialization
        data = {
            "total_revenue": stats["total_revenue"],
            "total_bookings": stats["total_bookings"],
            "active_boxes_count": approved_boxes.count(),
            "pending_boxes_count": pending_boxes.count(),
            "rejected_boxes_count": rejected_boxes.count(),
            "avg_rating": round(stats["avg_rating"], 1),
            "sports_distribution": dict(sports_count),
            "revenue_chart_labels": revenue_chart_labels,
            "revenue_chart_data": revenue_chart_data,
            "bookings_chart_labels": bookings_chart_labels,
            "bookings_chart_data": bookings_chart_data,
            "recent_bookings": recent_bookings_data,  # Use the formatted data instead of queryset
            "all_owner_boxes": all_owner_boxes,
        }

        serializer = OwnerDashboardStatsSerializer(instance=data)
        return Response(serializer.data)