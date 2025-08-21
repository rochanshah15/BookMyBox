from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
import json

def custom_404_view(request, exception=None):
    """
    Custom 404 error handler for both web pages and API endpoints
    """
    # Check if this is an API request
    if request.path.startswith('/api/') or request.META.get('HTTP_ACCEPT', '').startswith('application/json'):
        return JsonResponse({
            'error': 'Not Found',
            'message': 'The requested API endpoint does not exist.',
            'status_code': 404,
            'path': request.path,
            'method': request.method,
            'available_endpoints': [
                '/api/user/ - User authentication',
                '/api/boxes/ - Sports box listings', 
                '/api/bookings/ - Booking management',
                '/api/chatbot - AI chatbot service',
                '/api/dashboard/ - User dashboard',
                '/api/owner_dashboard/ - Owner dashboard'
            ],
            'timestamp': timezone.now().isoformat()
        }, status=404)
    
    # For web requests, return HTML error page
    context = {
        'request': request,
        'timestamp': timezone.now().strftime('%Y-%m-%d %H:%M:%S UTC')
    }
    return render(request, '404.html', context, status=404)

def custom_500_view(request):
    """
    Custom 500 error handler for both web pages and API endpoints
    """
    # Check if this is an API request
    if request.path.startswith('/api/') or request.META.get('HTTP_ACCEPT', '').startswith('application/json'):
        return JsonResponse({
            'error': 'Internal Server Error',
            'message': 'Something went wrong on our server. Please try again later.',
            'status_code': 500,
            'timestamp': timezone.now().isoformat()
        }, status=500)
    
    # For web requests, return HTML error page
    return render(request, '500.html', status=500)

def custom_400_view(request, exception=None):
    """
    Custom 400 error handler for bad requests
    """
    if request.path.startswith('/api/') or request.META.get('HTTP_ACCEPT', '').startswith('application/json'):
        return JsonResponse({
            'error': 'Bad Request',
            'message': 'The request was malformed or invalid.',
            'status_code': 400,
            'timestamp': timezone.now().isoformat()
        }, status=400)
    
    return render(request, '404.html', {'request': request}, status=400)

def custom_403_view(request, exception=None):
    """
    Custom 403 error handler for forbidden requests
    """
    if request.path.startswith('/api/') or request.META.get('HTTP_ACCEPT', '').startswith('application/json'):
        return JsonResponse({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource.',
            'status_code': 403,
            'timestamp': timezone.now().isoformat()
        }, status=403)
    
    return render(request, '404.html', {'request': request}, status=403)
