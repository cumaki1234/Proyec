from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.db import transaction
from Bodega.models import Bodegas
from Sucursal.models import Sucursales
from Login.models import Cuenta
import json
# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class CrearBodegaView(View):
    @method_decorator(login_required)  # Aplica el decorador login_required
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            if cuenta.rol != 'A':
                return JsonResponse({'error': 'No tienes permisos para crear una bodega'}, status=403)

            data = json.loads(request.body)
            nombrebog = data.get('nombrebog')
            descripcion= data.get('descripcion')
            idsucursal=data.get('id_sucursal')
            bodega_nueva  = Bodegas.objects.create(
                nombrebog=nombrebog,
                descripcion=descripcion,
                id_sucursal =Sucursales.objects.filter(id_sucursal=idsucursal).first()
            )

            return JsonResponse({'mensaje': 'Bodega creada con éxito'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)