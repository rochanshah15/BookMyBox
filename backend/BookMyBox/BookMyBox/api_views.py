from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Simple health check endpoint to verify API is working
    """
    return JsonResponse({
        'status': 'healthy',
        'message': 'BookMyBox API is running successfully',
        'endpoints': {
            'user': '/api/user/',
            'boxes': '/api/boxes/',
            'bookings': '/api/bookings/',
            'chatbot': '/api/chatbot',
            'dashboard': '/api/dashboard/',
            'owner_dashboard': '/api/owner_dashboard/'
        }
    })

@csrf_exempt
@require_http_methods(["GET"])
def api_info(request):
    """
    API information endpoint
    """
    return JsonResponse({
        'name': 'BookMyBox API',
        'version': '1.0.0',
        'description': 'Sports facility booking platform API',
        'documentation': 'Available endpoints listed below',
        'endpoints': {
            'Authentication': {
                'login': 'POST /api/user/login/',
                'register': 'POST /api/user/register/',
                'profile': 'GET /api/user_profile/'
            },
            'Boxes': {
                'list': 'GET /api/boxes/',
                'detail': 'GET /api/boxes/{id}/',
                'public_detail': 'GET /api/boxes/public/{id}/'
            },
            'Bookings': {
                'create': 'POST /api/bookings/',
                'list': 'GET /api/bookings/',
                'booked_slots': 'GET /api/bookings/booked_slots/'
            },
            'Dashboard': {
                'user': 'GET /api/dashboard/',
                'favorites': 'GET /api/dashboard/favorites/',
                'owner': 'GET /api/owner_dashboard/'
            },
            'AI Assistant': {
                'chat': 'POST /api/chatbot'
            }
        }
    })
