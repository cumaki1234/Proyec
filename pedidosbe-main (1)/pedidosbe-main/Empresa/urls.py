from django.urls import path
from .views import EmpresaDatosView,EditarEmpresaDatosView

urlpatterns = [
    path('infoEmpresa/', EmpresaDatosView.as_view(), name='Empresa_datos'),
    path('editar/', EditarEmpresaDatosView.as_view(), name='EditarEmpresaDatosView'),
]