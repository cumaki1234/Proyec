from django.http import JsonResponse
from django.db.models import Max, ExpressionWrapper, IntegerField
from django.views import View
from .models import *
from Login.models import Cuenta
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from PIL import Image, UnidentifiedImageError
from Login.models import Cuenta
from Combos.models import Combo
from django.db import transaction
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator,EmptyPage


import json
from django.db.models import Max, F

@method_decorator(csrf_exempt, name='dispatch')
class CrearTipoProducto(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear un tipo de producto'}, status=403)
            data = json.loads(request.body)
            tp_nombre = data.get('tp_nombre')
            descripcion = data.get('descripcion')

            tipo_producto = TiposProductos.objects.create(tpnombre=tp_nombre, descripcion=descripcion)
            tipo_producto.save()

            return JsonResponse({'mensaje': 'Tipo de producto creado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class tipoProductoExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            tpnombre = data.get('tpnombre')

            obt=TiposProductos.objects.filter(tpnombre=tpnombre).first()
            if obt is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CategoriaExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            catnombre = data.get('catnombre')

            obt=Categorias.objects.filter(catnombre=catnombre).first()
            if obt is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CrearCategoria(View):
    permission_classes = (IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
                #return JsonResponse({'error': 'No tienes permisos para crear una categoría'}, status=403)

            id_tipo_producto = request.POST.get('id_tipoproducto')
            cat_nombre = request.POST.get('catnombre')
            descripcion = request.POST.get('descripcion')

            imagen_archivo = request.FILES.get('imagencategoria')  # Cambiado a request.FILES
            image_64_encode=None
            if imagen_archivo:
                try:
                    image_read = imagen_archivo.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

            tipo_producto = TiposProductos.objects.get(id_tipoproducto=id_tipo_producto)

            categoria = Categorias(
                id_tipoproducto=tipo_producto,
                catnombre=cat_nombre,
                descripcion=descripcion,
                imagencategoria=image_64_encode
            )
            categoria.save()

            return JsonResponse({'mensaje': 'Categoría creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class ListaTiposYCategorias(View):
    def get(self, request, *args, **kwargs):
        try:
            tipos_productos = TiposProductos.objects.all()
            data = []

            for tipo_producto in tipos_productos:
                categorias = Categorias.objects.filter(id_tipoproducto=tipo_producto)
                categorias_data = []

                for categoria in categorias:
                    imagencategoria = categoria.imagencategoria
                    imagencategoria_base64 = None

                    if imagencategoria:
                        imagencategoria_base64 = self.convertir_imagen_a_base64(imagencategoria)

                    categoria_data = {
                        'id_categoria': categoria.id_categoria,
                        'imagencategoria': imagencategoria_base64,
                        'catnombre': categoria.catnombre,
                        'descripcion': categoria.descripcion
                    }

                    categorias_data.append(categoria_data)

                tipo_producto_data = {
                    'id_tipoproducto': tipo_producto.id_tipoproducto,
                    'tpnombre': tipo_producto.tpnombre,
                    'descripcion': tipo_producto.descripcion,
                    'categorias': categorias_data
                }

                data.append(tipo_producto_data)

            return JsonResponse({'tipos_y_categorias': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def convertir_imagen_a_base64(self, imagen):
        # Convierte la imagen a base64 y devuelve la cadena resultante
        return base64.b64encode(imagen).decode('utf-8') if imagen else None
@method_decorator(csrf_exempt, name='dispatch')
class ListaTiposProductos(View):
    def get(self, request, *args, **kwargs):
        try:
            tipos_productos = TiposProductos.objects.all()
            data = []
            for tipo_producto in tipos_productos:
                tipo_producto_data = {
                    'id_tipoproducto': tipo_producto.id_tipoproducto,
                    'tpnombre': tipo_producto.tpnombre,
                    'descripcion': tipo_producto.descripcion,
                }

                data.append(tipo_producto_data)

            return JsonResponse({'tipos_productos': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class ListaCategorias(View):
    def get(self, request, *args, **kwargs):
        try:
            categorias = Categorias.objects.all()
            data = []

            for categoria in categorias:
                imagencategoria = categoria.imagencategoria
                imagencategoria_base64 = None

                if imagencategoria:
                    try:
                        byteImg = base64.b64decode(imagencategoria)
                        imagencategoria_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")

                categoria_data = {
                    'id_categoria': categoria.id_categoria,
                    'imagencategoria': imagencategoria_base64,
                    'catnombre': categoria.catnombre,
                    'descripcion': categoria.descripcion
                }

                data.append(categoria_data)

            return JsonResponse({'categorias': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
#@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarTipoProducto(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
                #return JsonResponse({'error': 'No tienes permisos para crear editar un tipo de producto'}, status=403)
            tipo_producto_id = kwargs.get('tipo_producto_id') 
            tipo_producto = TiposProductos.objects.get(id_tipoproducto=tipo_producto_id)
            tipo_producto.tpnombre = request.POST.get('tpnombre', tipo_producto.tpnombre)
            tipo_producto.descripcion = request.POST.get('descripcion', tipo_producto.descripcion)
            tipo_producto.save()

            return JsonResponse({'mensaje': 'Tipo de producto editado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
#@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarCategoria(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
                #return JsonResponse({'error': 'No tienes permisos para crear editar una categoría'}, status=403)
            categoria_id = kwargs.get('categoria_id')  # Asegúrate de tener la URL configurada para recibir el ID de la categoría
            categoria = Categorias.objects.get(id_categoria=categoria_id)
            imagencategoria = request.FILES.get('imagencategoria')
            categoria.catnombre = request.POST.get('catnombre')
            categoria.descripcion = request.POST.get('descripcion')
            categoria.id_tipoproducto = TiposProductos.objects.get(id_tipoproducto=request.POST.get('id_tipoproducto', categoria.id_tipoproducto.id_tipoproducto))
            if imagencategoria:
                try:
                    image_read = imagencategoria.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                    categoria.imagencategoria=image_64_encode
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)
            
            categoria.save()
            return JsonResponse({'mensaje': 'Categoría editada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CrearUnidadMedida(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
           #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear una unidad de medida'}, status=403)
            data = json.loads(request.body)
            nombre_um = data.get('nombre_um')
            unidad_medida = UnidadMedida.objects.create(nombreum=nombre_um)
            unidad_medida.save()
            return JsonResponse({'mensaje': 'Unidad de medida creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CrearProducto(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear un producto'}, status=403)
            id_categoria = request.POST.get('id_categoria')
            id_um = request.POST.get('id_um')
            imagen_p = request.FILES.get('imagen_p')
            puntosp = request.POST.get('puntos_p')
            nombreproducto = request.POST.get('nombre_producto')
            descripcionproducto = request.POST.get('descripcion_producto')
            preciounitario = request.POST.get('precio_unitario')
            iva = request.POST.get('iva')
            ice = request.POST.get('ice')
            irbpnr = request.POST.get('irbpnr')
            image_64_encode=None
            if imagen_p:
                try:
                    image_read = imagen_p.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

            # Crear el producto
            categoria = Categorias.objects.get(id_categoria=id_categoria)
            unidad_medida = UnidadMedida.objects.get(idum=id_um)

            producto = Producto.objects.create(
                id_categoria=categoria,
                id_um=unidad_medida,
                imagenp=image_64_encode,
                puntosp=puntosp,
                codprincipal=obtener_siguiente_codprincipal(),
                nombreproducto=nombreproducto,
                descripcionproducto=descripcionproducto,
                preciounitario=preciounitario,
                iva=iva,
                ice=ice,
                irbpnr=irbpnr
            )
            producto.save()

            return JsonResponse({'mensaje': 'Producto creado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarUnidadMedida(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            if cuenta.rol != 'S':
                return JsonResponse({'error': 'No tienes permisos para editar una unidad de medida'}, status=403)

            unidad_id = kwargs.get('unidad_id')
            unidad = UnidadMedida.objects.get(idum=unidad_id)

            unidad.nombreum = request.POST.get('nombreum', unidad.nombreum)
            unidad.save()

            return JsonResponse({'mensaje': 'Unidad de medida editada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarProducto(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            if cuenta.rol != 'S':
                return JsonResponse({'error': 'No tienes permisos para editar un producto'}, status=403)

            producto_id = kwargs.get('producto_id')  
            producto = Producto.objects.get(id_producto=producto_id)

            producto.id_categoria = Categorias.objects.get(id_categoria=request.POST.get('id_categoria', producto.id_categoria.id_categoria))
            producto.id_um = UnidadMedida.objects.get(idum=request.POST.get('id_um', producto.id_um.idum))
            producto.imagenp = request.POST.get('imagenp', producto.imagenp)
            producto.puntosp = request.POST.get('puntosp', producto.puntosp)
            producto.codprincipal = request.POST.get('codprincipal', producto.codprincipal)
            producto.nombreproducto = request.POST.get('nombreproducto', producto.nombreproducto)
            producto.descripcionproducto = request.POST.get('descripcionproducto', producto.descripcionproducto)
            producto.preciounitario = request.POST.get('preciounitario', producto.preciounitario)
            producto.iva = request.POST.get('iva', producto.iva)
            producto.ice = request.POST.get('ice', producto.ice)
            producto.irbpnr = request.POST.get('irbpnr', producto.irbpnr)

            producto.save()

            return JsonResponse({'mensaje': 'Producto editado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
class ListarProductos(View):
    def get(self, request, *args, **kwargs):
        try:
            # Parámetros de paginación y búsqueda
            page = int(request.GET.get('page', 1))
            size = int(request.GET.get('size', 8))
            search = request.GET.get('search', '')

            # Filtrar productos por término de búsqueda
            productos = Producto.objects.filter(nombreproducto__icontains=search)

            # Configurar la paginación
            paginator = Paginator(productos, size)

            try:
                # Obtener la página actual
                productos_pagina = paginator.page(page)
            except EmptyPage:
                # Si la página está fuera de rango, devolver una lista vacía
                productos_pagina = []

            # Convertir productos a formato JSON
            lista_productos = []
            for producto in productos_pagina:
                imagen_base64 = None

                if producto.imagenp:
                    try:
                        byteImg = base64.b64decode(producto.imagenp)
                        imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")

                datos_producto = {
                    'id_producto': producto.id_producto,
                    'id_categoria': producto.id_categoria.id_categoria,
                    'id_um': producto.id_um.idum,
                    'imagenp': imagen_base64,
                    'puntosp': producto.puntosp,
                    'codprincipal': producto.codprincipal,
                    'nombreproducto': producto.nombreproducto,
                    'descripcionproducto': producto.descripcionproducto,
                    'preciounitario': str(producto.preciounitario),
                    'iva': producto.iva,
                    'ice': producto.ice,
                    'irbpnr': producto.irbpnr
                }

                lista_productos.append(datos_producto)

            # Devolver la lista de productos paginada en formato JSON
            return JsonResponse({'productos': lista_productos, 'total': paginator.count}, safe=False)

        except Exception as e:
            # Manejar errores aquí
            return JsonResponse({'error': str(e)}, status=500)
def obtener_siguiente_codprincipal():
    max_cod_producto = Producto.objects.aggregate(max_cod=Max(ExpressionWrapper(F('codprincipal'), output_field=IntegerField())))

    # Obtener el CodPrincipal más alto de Combo
    max_cod_combo = Combo.objects.aggregate(max_cod=Max(ExpressionWrapper(F('codprincipal'), output_field=IntegerField())))

    # Obtener el máximo entre los dos y calcular el siguiente número
    ultimo_numero = max(int(max_cod_producto['max_cod'] or 0), int(max_cod_combo['max_cod'] or 0))
    siguiente_numero = ultimo_numero + 1

    # Formatear el siguiente número como CodPrincipal
    siguiente_codprincipal = f'{siguiente_numero:025d}'

    return siguiente_codprincipal
