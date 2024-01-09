from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.db import transaction
from PIL import Image
import base64
from io import BytesIO
import json

from .models import Empresa

@method_decorator(csrf_exempt, name='dispatch')
class EmpresaDatosView(View):
    def post(self, request, *args, **kwargs):
        try:

            empresa = Empresa.objects.first()

            if empresa:
                imagen_base64 = None

                if empresa.elogo:
                    try:
                        byteImg = base64.b64decode(empresa.elogo)
                        imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")
                empresa_info = {
                    'id_empresa': empresa.id_empresa,
                    'enombre': empresa.enombre,
                    'direccion': empresa.direccion,
                    'etelefono': empresa.etelefono,
                    'correoelectronico': empresa.correoelectronico,
                    'fechafundacion': empresa.fechafundacion,
                    'sitioweb': empresa.sitioweb,
                    'eslogan': empresa.eslogan,
                    'elogo':imagen_base64,
                    'edescripcion':empresa.edescripcion,
                    'docmenu':empresa.docmenu

                }

                # Devuelve la información como respuesta JSON
                return JsonResponse({'mensaje': 'Datos de la empresa', 'empresa_info': empresa_info})
            else:
                return JsonResponse({'mensaje': 'No hay registros en la tabla Empresa'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class EditarEmpresaDatosView(View):
    def post(self, request, *args, **kwargs):
        empresa= Empresa.objects.first()

        empresa.enombre = request.POST.get('enombre', empresa.enombre)
        empresa.direccion = request.POST.get('direccion', empresa.direccion)
        empresa.etelefono = request.POST.get('etelefono', empresa.etelefono)
        empresa.correoelectronico = request.POST.get('correoelectronico', empresa.correoelectronico)
        empresa.fechafundacion = request.POST.get('fechafundacion', empresa.fechafundacion)
        empresa.sitioweb = request.POST.get('sitioweb', empresa.sitioweb)
        empresa.eslogan = request.POST.get('eslogan', empresa.eslogan)
        empresa.edescripcion = request.POST.get('edescripcion', empresa.edescripcion)
        empresa.docmenu = request.FILES.get('docmenu', empresa.docmenu)
        imagen_p = request.FILES.get('elogo')
        image_64_encode=None
        if imagen_p:
                try:
                    
                    image_read = imagen_p.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                    empresa.elogo = image_64_encode
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)
        

        empresa.save()

        return JsonResponse({'mensaje': 'Datos de la empresa actualizados correctamente'})
