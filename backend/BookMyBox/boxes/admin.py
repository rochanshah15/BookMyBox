# boxes/admin.py

from django.contrib import admin
from .models import Box, Review, UserFavoriteBox

@admin.register(Box)
class BoxAdmin(admin.ModelAdmin):
    list_display = ('name', 'sport', 'location', 'price', 'rating', 'capacity', 'status', 'owner')
    search_fields = ('name', 'sport', 'location', 'description')
    list_filter = ('sport', 'location', 'rating', 'status', 'is_featured')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at', 'submitted_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'sport', 'sports', 'location', 'description', 'full_description')
        }),
        ('Pricing & Capacity', {
            'fields': ('price', 'capacity', 'rating')
        }),
        ('Media & Amenities', {
            'fields': ('image', 'images', 'amenities', 'rules')
        }),
        ('Location Coordinates', {
            'fields': ('latitude', 'longitude')
        }),
        ('Management', {
            'fields': ('owner', 'status', 'is_featured', 'rejection_reason')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'submitted_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('box', 'user', 'rating', 'date')
    list_filter = ('rating', 'date')
    search_fields = ('box__name', 'user__username', 'comment') # Adjust 'user__username' if your CustomUser uses a different field for display.
    raw_id_fields = ('box', 'user') # Useful for selecting related objects when many exist
    
admin.site.register(UserFavoriteBox)
