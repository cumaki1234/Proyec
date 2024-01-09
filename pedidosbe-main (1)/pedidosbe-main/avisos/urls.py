from django.urls import path
from .views import AvisosPrincipalesListView,CrearAviso,EditarAviso

urlpatterns = [
    path('avisos/', AvisosPrincipalesListView.as_view(), name='avisos'),
    path('crear/', CrearAviso.as_view(), name='crearaviso'),
    path('editar/<int:id_aviso>/', EditarAviso.as_view(), name='EditarAviso'),
]