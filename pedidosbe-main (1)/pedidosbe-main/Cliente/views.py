from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json

@method_decorator(csrf_exempt, name='dispatch')
class ActualizarClienteView(View):
    @login_required
    def post(self, request, *args, **kwargs):
        try:
            user = request.user  # Obtener el usuario autenticado

            # Obtener los datos del cuerpo de la solicitud
            data = json.loads(request.body)
            
            # Actualizar los campos en el modelo Clientes asociado al usuario
            user.clientes.crazon_social = data.get('crazon_social', user.clientes.crazon_social)
            user.clientes.snombre = data.get('snombre', user.clientes.snombre)
            user.clientes.capellido = data.get('capellido', user.clientes.capellido)
            user.clientes.ruc_cedula = data.get('ruc_cedula', user.clientes.ruc_cedula)
            user.clientes.ccorreo_electronico = data.get('ccorreo_electronico', user.clientes.ccorreo_electronico)
            user.clientes.ubicacion = data.get('ubicacion', user.clientes.ubicacion)
            
            # Guardar los cambios
            user.clientes.save()

            return JsonResponse({'mensaje': 'Datos del cliente actualizados correctamente'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
