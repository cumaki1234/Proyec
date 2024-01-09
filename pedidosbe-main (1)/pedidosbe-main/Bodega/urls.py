from django.urls import path
from .views import CrearBodegaView

urlpatterns = [
    path('crear/', CrearBodegaView.as_view(), name='crear_bodega'),
]
