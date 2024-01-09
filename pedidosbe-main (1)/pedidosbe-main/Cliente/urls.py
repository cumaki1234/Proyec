from django.urls import path
from .views import ActualizarClienteView

urlpatterns = [
    path('actualizar_cliente/', ActualizarClienteView.as_view(), name='actualizar_cliente'),
]
