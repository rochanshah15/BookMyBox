from django.urls import path
from . import views

urlpatterns = [
    path('api/chatbot', views.chatbot_response, name='chatbot_response'),
]
