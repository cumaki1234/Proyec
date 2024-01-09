from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import transaction

from .models import Administrador, Mesas

@method_decorator(csrf_exempt, name='dispatch')
class CrearMesa(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # Puedes descomentar y adaptar esta sección según tus necesidades de autenticación y autorización
            # cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            # if cuenta.rol != 'S':
            #     return JsonResponse({'error': 'No tienes permisos para crear una mesa'}, status=403)
        
            id_administrador = request.POST.get('id_administrador')
            observacion = request.POST.get('observacion')
            estado = request.POST.get('estado')
            activa = request.POST.get('activa')
            max_personas = request.POST.get('max_personas')

            administrador = Administrador.objects.get(id_Administrador=id_administrador)

            mesa = Mesas(
                id_administrador=administrador,
                observacion=observacion,
                estado=estado,
                activa=activa,
                maxpersonas=max_personas
            )
            mesa.save()

            return JsonResponse({'mensaje': 'Mesa creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)