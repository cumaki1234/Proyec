from django.urls import path
from .views import CrearUsuarioView

urlpatterns = [
    path('crear/', CrearUsuarioView.as_view(), name='crearempleado'),
]