from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from .models import *
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import transaction
from Login.models import Cuenta
from PIL import Image, UnidentifiedImageError
import base64
from Producto.views import obtener_siguiente_codprincipal
import json

@method_decorator(csrf_exempt, name='dispatch')
class CrearCategoriaCombo(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear una categoría de combo'}, status=403)
        
            cat_nombre = request.POST.get('cat_nombre')
            descripcion = request.POST.get('descripcion')
            imagencategoria = request.FILES.get('imagencategoria')
            image_64_encode=None
            if imagencategoria:
                try:
                    image_read = imagencategoria.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)
            categoria = CategoriasCombos(
                catnombre=cat_nombre,
                descripcion=descripcion,
                imagencategoria=image_64_encode
            )
            categoria.save()
            return JsonResponse({'mensaje': 'Categoría de combo creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class categoriaComboExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            cat_nombre = data.get('catnombre')

            categoria=CategoriasCombos.objects.filter(catnombre=cat_nombre).first()
            if categoria is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class ComboExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            nombre_cb = data.get('nombre_cb')
            cb=Combo.objects.filter(nombrecb=nombre_cb).first()
            if cb is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CrearCombo(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear un combo'}, status=403)

            id_cat_combo = request.POST.get('id_cat_combo')
            imagenc = request.FILES.get('imagen_c')
            puntos_cb = request.POST.get('puntos_cb')
            nombre_cb = request.POST.get('nombre_cb')
            descripcioncombo = request.POST.get('descripcion_combo')
            preciounitario = request.POST.get('precio_unitario')
            detalle_combo_lista = json.loads(request.POST.get('detalle_combo'))
            image_64_encode=None
            if imagenc:
                try:
                    image_read = imagenc.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

            categoria_combo = CategoriasCombos.objects.get(id_catcombo=id_cat_combo)
            combo = Combo.objects.create(
                id_catcombo=categoria_combo,
                imagenc=image_64_encode,
                puntoscb=puntos_cb,
                codprincipal=obtener_siguiente_codprincipal(),
                nombrecb=nombre_cb,
                descripcioncombo=descripcioncombo,
                preciounitario=preciounitario,
                iva='0',  # Inicializar con valor por defecto
                ice='0',  # Inicializar con valor por defecto
                irbpnr='0'  # Inicializar con valor por defecto
            )
            combo.save()

            # Procesa los detalles del combo
            detalle_combo_data = json.loads(request.POST.get('detalle_combo', '[]'))
            
            # Procesa los detalles del combo
            for detalle_data in detalle_combo_data:
                id_producto = detalle_data.get('id_producto')
                cantidad = detalle_data.get('cantidad')
                producto = Producto.objects.get(id_producto=id_producto)

                # Crea y guarda el detalle del combo
                DetalleCombo.objects.create(
                    id_combo=combo,
                    id_producto=producto,
                    cantidad=cantidad
                )
                combo.iva = '1' if producto.iva == '1' else combo.iva
                combo.ice = '1' if producto.ice == '1' else combo.ice
                combo.irbpnr = '1' if producto.irbpnr == '1' else combo.irbpnr

            combo.save()

            return JsonResponse({'mensaje': 'Combo creado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarCombo(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            if cuenta.rol != 'S':
                return JsonResponse({'error': 'No tienes permisos para editar un combo'}, status=403)

            combo_id = kwargs.get('combo_id')  # Asegúrate de tener la URL configurada para recibir el ID del combo
            combo = Combo.objects.get(id_combo=combo_id)
            combo.id_catcombo = CategoriasCombos.objects.get(id_catcombo=request.POST.get('id_catcombo', combo.id_catcombo.id_catcombo))
            combo.imagenc = request.POST.get('imagenc', combo.imagenc)
            combo.puntoscb = request.POST.get('puntoscb', combo.puntoscb)
            combo.nombrecb = request.POST.get('nombrecb', combo.nombrecb)
            combo.descripcioncombo = request.POST.get('descripcioncombo', combo.descripcioncombo)
            combo.preciounitario = request.POST.get('preciounitario', combo.preciounitario)
            combo.iva = request.POST.get('iva', combo.iva)
            combo.ice = request.POST.get('ice', combo.ice)
            combo.irbpnr = request.POST.get('irbpnr', combo.irbpnr)

            combo.save()

            return JsonResponse({'mensaje': 'Combo editado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CategoriasCombosListView(View):
    def get(self, request, *args, **kwargs):
        try:
            categorias_combos = CategoriasCombos.objects.all()
            categorias_list = []

            for categoria in categorias_combos:
                if categoria.imagencategoria:
                    try:
                        byteImg = base64.b64decode(categoria.imagencategoria)
                        imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                        categoria_info = {
                            'id_catcombo': categoria.id_catcombo,
                            'imagencategoria': imagen_base64,
                            'catnombre': categoria.catnombre,
                            'descripcion': categoria.descripcion,
                        }
                        categorias_list.append(categoria_info)
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")
                else:
                    categoria_info = {
                        'id_catcombo': categoria.id_catcombo,
                        'imagencategoria': None,
                        'catnombre': categoria.catnombre,
                        'descripcion': categoria.descripcion,
                    }
                    categorias_list.append(categoria_info)

            return JsonResponse({'categorias_combos': categorias_list}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)