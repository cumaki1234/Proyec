from django.urls import path
from .views import *

urlpatterns = [
    path('crear/', CerrarSesionView.as_view(), name='crearmesa'),
]