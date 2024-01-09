import json 
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from .models import Sucursales
import base64
from horariossemanales.models import Horariossemanales
from GeoSector.models import Geosectores
from Empresa.models import Empresa
from Ubicaciones.models import Ubicaciones
from django.utils.decorators import method_decorator 
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from Login.models import Cuenta
from io import BytesIO
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from PIL import Image

class SucursalesListView(View):
    def get(self, request, *args, **kwargs):
        try:
            sucursales = Sucursales.objects.all().order_by('id_sucursal')
            paginator = Paginator(sucursales, 200)  # 10 sucursales por página, ajusta según sea necesario
            page = request.POST.get('pageSize')

            try:
                sucursales_list = paginator.page(page)
            except PageNotAnInteger:
                sucursales_list = paginator.page(1)
            except EmptyPage:
                sucursales_list = paginator.page(paginator.num_pages)

            serialized_sucursales = []
            for sucursal in sucursales_list:
                if sucursal.imagensucursal:
                    img = Image.open(BytesIO(base64.b64decode(sucursal.imagensucursal)))
                    img = img.resize((500, 500))
                    buffered = BytesIO()
                    img.save(buffered, format="PNG")
                    imagen_base64_resized = base64.b64encode(buffered.getvalue()).decode('utf-8')
                else:
                    imagen_base64_resized = None
                ubicacion_info = {
                    'id_ubicacion': sucursal.id_ubicacion.id_ubicacion if sucursal.id_ubicacion else None,
                    'latitud': sucursal.id_ubicacion.latitud if sucursal.id_ubicacion else None,
                    'longitud': sucursal.id_ubicacion.longitud if sucursal.id_ubicacion else None,
                    'udescripcion': sucursal.id_ubicacion.udescripcion if sucursal.id_ubicacion else None,
                }
                sucursal_info = {
                    'id_sucursal': sucursal.id_sucursal,
                    'srazon_social': sucursal.srazon_social,
                    'sruc': sucursal.sruc,
                    'sestado': sucursal.sestado,
                    'scapacidad': sucursal.scapacidad,
                    'scorreo': sucursal.scorreo,
                    'stelefono': sucursal.stelefono,
                    'sdireccion': sucursal.sdireccion,
                    'snombre': sucursal.snombre,
                    'fsapertura': sucursal.fsapertura.strftime('%Y-%m-%d') if sucursal.fsapertura else None,
                    'id_horarios': sucursal.id_horarios.id_horarios if hasattr(sucursal, 'id_horarios') else None,
                    'id_geosector': getattr(sucursal.id_geosector, 'id_geosector', None),
                    'firmaelectronica': sucursal.firmaelectronica,
                    'id_empresa': sucursal.id_empresa_id,
                    'id_ubicacion': ubicacion_info,
                    'imagensucursal': imagen_base64_resized,
                }
                serialized_sucursales.append(sucursal_info)

            return JsonResponse({'sucursales': serialized_sucursales}, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class Crearsucursal(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear una sucursal'}, status=403)
            razon_social = request.POST.get('razonsocial')
            ruc = request.POST.get('sruc')
            capacidad=request.POST.get('capacidad')
            correo= request.POST.get('scorreo')
            telefono= request.POST.get('ctelefono')
            direccion= request.POST.get('sdireccion')
            nombre= request.POST.get('snombre')
            id_horarios=  request.POST.get('horario')
            idgeosector= request.POST.get('geosectorid')
            firmaelectronica = request.POST.get('firma')
            latitudx = request.POST.get('latitud')
            longitudx = request.POST.get('longitud')
            imagen= request.FILES.get('imagen')
            image_64_encode=None
            if imagen:
                try:
                    image_read = imagen.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)
            if latitudx is not None and longitudx is not None:
                try:
                    sucursal_nueva = Sucursales.objects.create(
                        srazon_social=razon_social,
                        sruc=ruc,
                        sestado='1',
                        scapacidad=capacidad,
                        scorreo=correo,
                        stelefono=telefono,
                        sdireccion=direccion,
                        snombre=nombre,
                        id_horarios=Horariossemanales.objects.create(**id_horarios) if id_horarios is not None else None,
                        id_geosector=Geosectores.objects.create(**idgeosector) if idgeosector is not None else None,
                        firmaelectronica=firmaelectronica,
                        id_empresa=Empresa.objects.filter(id_empresa=1).first(),
                        id_ubicacion=Ubicaciones.objects.create(
                            latitud=latitudx,
                            longitud=longitudx,
                        ),
                        imagensucursal=image_64_encode,
                    )
                    return JsonResponse({'mensaje': 'Sucursal creada con éxito'})
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=400)
            sucursal_nueva  = Sucursales.objects.create(
                srazon_social=razon_social,
                sruc=ruc,
                sestado ='1',
                scapacidad = capacidad,
                scorreo =correo,
                stelefono=telefono,
                sdireccion=direccion,
                snombre=nombre,
                id_horarios=Horariossemanales.objects.create(**id_horarios) if id_horarios is not None else None,
                id_geosector=Geosectores.objects.create(**idgeosector) if idgeosector is not None else None,
                firmaelectronica=firmaelectronica,
                id_empresa=Empresa.objects.filter(id_empresa=1).first(),
                imagensucursal=image_64_encode,
            )
            return JsonResponse({'mensaje': 'Sucursal creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class actdesSucursal(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear una sucursal'}, status=403)
            id_sucursal = request.POST.get('id_sucursal')
            sestado = request.POST.get('sestado')
            sucursal = Sucursales.objects.get(id_sucursal=id_sucursal)
            if sestado:
                sucursal.sestado=sestado
                sucursal.save()
                return JsonResponse({'mensaje': 'Estado cambiado con exito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class sucursalExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            srazon_social = data.get('srazon_social')
            sruc = data.get('sruc')
            snombre = data.get('snombre')
            if srazon_social is not None:
                if Sucursales.objects.filter(srazon_social=srazon_social).first():
                    return JsonResponse({'mensaje': '1'})
            if sruc is not None:
                if Sucursales.objects.filter(sruc=sruc).first():
                    return JsonResponse({'mensaje': '1'})
            if snombre is not None:
                if Sucursales.objects.filter(snombre=snombre).first():
                    return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)