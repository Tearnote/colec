from django.urls import path, include

from . import views

urlpatterns = [
    path('login/', views.login),
    path('logout/', views.logout),
    path('me/', views.me),
]
