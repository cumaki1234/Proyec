from django.urls import path
from .views import SucursalesListView, Crearsucursal,sucursalExist,actdesSucursal

urlpatterns = [
    path('sucusarleslist/', SucursalesListView.as_view(), name='SucursalesListView'),
    path('crear/', Crearsucursal.as_view(), name='Crearsucursal'),
    path('sucursalExist/', sucursalExist.as_view(), name='sucursalExist'),
    path('actsucursal/', actdesSucursal.as_view(), name='actdesSucursal')
]