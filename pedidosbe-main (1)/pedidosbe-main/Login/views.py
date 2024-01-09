from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.db import transaction
import json
from .models import Cuenta, Clientes
from django.contrib.auth.hashers import make_password, check_password
from Administrador.models import Administrador
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
import jwt
from django.conf import settings

@method_decorator(csrf_exempt, name='dispatch')
class CrearUsuarioView(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            nombre_usuario = data.get('nombreusuario')
            contrasenia = data.get('contrasenia')
            ctelefono = data.get('ctelefono')
            razons= data.get('crazon_social')
            telefono=data.get('ctelefono')
            tipocliente= data.get('tipocliente')
            snombre=data.get('snombre')
            capellido=data.get('capellido')
            ruc_cedula= data.get('ruc_cedula')
            correorecuperacion=data.get('correorecuperacion')
            ubicacion=data.get('ubicacion')

            user = User.objects.create_user(username=nombre_usuario, password=contrasenia)


            cuenta_nueva  = Cuenta.objects.create(
                nombreusuario=nombre_usuario,
                contrasenia= make_password(contrasenia),
                estadocuenta ='1',
                rol = 'C',
                correorecuperacion =correorecuperacion
            )

            # Crear un nuevo cliente asociado al usuario y la cuenta
            cliente_nuevo  = Clientes.objects.create(
                ctelefono=ctelefono,
                id_cuenta=cuenta_nueva,
                crazon_social = razons,
                tipocliente = tipocliente,
                snombre = snombre,
                capellido = capellido,
                ruc_cedula = ruc_cedula,
                ccorreo_electronico = correorecuperacion,
                ubicacion = ubicacion
            )
        

            return JsonResponse({'mensaje': 'Usuario creado con éxito'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)


class IniciarSesionView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def generate_token(self, cuenta):
        payload = {
        'id_cuenta': cuenta.id_cuenta,
        'nombreusuario': cuenta.nombreusuario,
        'rol': cuenta.rol,
        # Agrega otros campos según sea necesario
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            nombre_usuario = data.get('nombreusuario')
            contrasenia = data.get('contrasenia')

            user = authenticate(username=nombre_usuario, password=contrasenia)

            if user is not None:
                login(request, user)

                if user.check_password(contrasenia):
                    cuenta = Cuenta.objects.filter(nombreusuario=user.username).first()

                    if cuenta:
                        token = self.generate_token(cuenta)

                        return JsonResponse({'token': token})
                    else:
                        return JsonResponse({'mensaje': 'La cuenta asociada al usuario no tiene información'}, status=404)
                else:
                    return JsonResponse({'mensaje': 'Contraseña incorrecta'}, status=401)
            else:
                return JsonResponse({'mensaje': 'Credenciales incorrectas'}, status=401)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class VerificarRolView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            token = data.get('token')

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)

            # Decodificar el token para obtener la información del usuario
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # Extraer el rol del payload
            rol = payload.get('rol')

            if rol:
                return JsonResponse({'rol': rol})
            else:
                return JsonResponse({'error': 'No se pudo extraer el rol del token'}, status=500)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expirado'}, status=401)

        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Token inválido'}, status=401)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def handle_cliente(self, cuenta):
        cliente = Clientes.objects.filter(id_cuenta=cuenta.id_cuenta).first()

        cliente_info = {
            'id_cliente' : cliente.id_cliente,
            'username':cliente.id_cuenta.nombreusuario,
            'razon_social': cliente.crazon_social,
            'telefono': cliente.ctelefono,
            'tipo_cliente': cliente.tipocliente,
            'nombre': cliente.snombre,
            'apellido': cliente.capellido,
            'puntos': cliente.cpuntos,
            'correo_electronico': cliente.ccorreo_electronico,
            'ubicacion': cliente.ubicacion,
            'fecha_registro':cliente.cregistro,
            'ruc_cedula':cliente.ruc_cedula,
            'id_cuenta':cliente.id_cuenta.id_cuenta,
            'ubicacion1': cliente.id_ubicacion1 if hasattr(cliente, 'id_ubicacion1') else None,
            'ubicacion2': cliente.id_ubicacion2 if hasattr(cliente, 'id_ubicacion2') else None,
            'ubicacion3': cliente.id_ubicacion3 if hasattr(cliente, 'id_ubicacion3') else None,
        }

        return JsonResponse({'mensaje': 'Inicio de sesión exitoso', 'cliente_info': cliente_info})
    def handle_administrador(self, cuenta):
        administrador = Administrador.objects.filter(id_cuenta=cuenta.id_cuenta).first()
        administrador_info = {
            'id_administrador':administrador.id_administrador,
            'telefono':administrador.telefono,
            'apellido':administrador.apellido,
            'nombre':administrador.nombre,
            'id_cuenta':administrador.id_cuenta.id_cuenta,
            'id_sucursal':administrador.id_sucursal if hasattr(administrador, 'id_sucursal') else None
        }
        return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Administrador','administrador_info':administrador_info})
    def handle_jefecocina(self, cuenta):
        # Realiza acciones específicas para el rol de Administrador
        return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Administrador'})
    def handle_mesero(self, cuenta):
        # Realiza acciones específicas para el rol de Administrador
        return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Administrador'})
    def handle_motorizado(self, cuenta):
        # Realiza acciones específicas para el rol de Administrador
        return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Administrador'})
    def handle_default(self, cuenta):
        return JsonResponse({'mensaje': 'Rol no reconocido'}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CerrarSesionView(View):
    def post(self, request, *args, **kwargs):
        try:
            usuario = User.objects.get(username='nombre_de_usuario')
            token = Token.objects.get(user=usuario)

    # Elimina el token
            token.delete()
                        
            return JsonResponse({'mensaje': 'Sesión cerrada con éxito'})
        except Token.DoesNotExist:
    # Maneja el caso en el que el token no existe
            print("El token no existe para este usuario.")          
@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarCliente(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            cuenta = Cuenta.objects.filter(nombreusuario=request.user.username).first()
            # Obtener datos del cliente a actualizar
            cliente_id = Clientes.objects.filter(id_cuenta=cuenta.id_cuenta).first().id_cliente  # Asegúrate de tener la URL configurada para recibir el ID del cliente

            # Obtener cliente existente
            cliente = Clientes.objects.get(id_cliente=cliente_id)

            # Actualizar solo los campos permitidos
            cliente.crazon_social = request.POST.get('crazon_social', cliente.crazon_social)
            cliente.ctelefono = request.POST.get('ctelefono', cliente.ctelefono)
            cliente.tipocliente = request.POST.get('tipocliente', cliente.tipocliente)
            cliente.snombre = request.POST.get('snombre', cliente.snombre)
            cliente.capellido = request.POST.get('capellido', cliente.capellido)
            cliente.ruc_cedula = request.POST.get('ruc_cedula', cliente.ruc_cedula)
            cliente.ccorreo_electronico = request.POST.get('ccorreo_electronico', cliente.ccorreo_electronico)
            cliente.ubicacion = request.POST.get('ubicacion', cliente.ubicacion)

            # Guardar el cliente actualizado
            cliente.save()

            return JsonResponse({'mensaje': 'Cliente editado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
class HomeView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)
@method_decorator(csrf_exempt, name='dispatch')
class usuarioExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            nombre_usuario = data.get('nombreusuario')

            cuenta=Cuenta.objects.filter(nombreusuario=nombre_usuario).first()
            if cuenta is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class telefonoExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            telefono = data.get('ctelefono')

            cliente=Clientes.objects.filter(ctelefono=telefono).first()
            if cliente is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class DocumentExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            ced = data.get('ruc_cedula')

            cliente=Clientes.objects.filter(ruc_cedula=ced).first()
            if cliente is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)