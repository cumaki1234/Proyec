from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('Login/', include('Login.urls')),
    path('cliente/', include('Cliente.urls')),
    path('empresa/', include('Empresa.urls')),
    path('sucursal/', include('Sucursal.urls')),
    path('bodega/', include('Bodega.urls')),
    path('producto/', include('Producto.urls')),
    path('combos/', include('Combos.urls')),
    path('avisos/', include('avisos.urls')),
    path('empleado/', include('Empleados.urls')),
    path('token/', 
          jwt_views.TokenObtainPairView.as_view(), 
          name ='token_obtain_pair'),
     path('token/refresh/', 
          jwt_views.TokenRefreshView.as_view(), 
          name ='token_refresh')
]

