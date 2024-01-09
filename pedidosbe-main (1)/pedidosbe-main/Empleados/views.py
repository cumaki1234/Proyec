from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Mesero,JefeCocina,Motorizado,Administrador
from Login.models import Cuenta
from django.views import View
from django.db import transaction
from Administrador.models import Administrador
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from Sucursal.models import Sucursales
import json

@method_decorator(csrf_exempt, name='dispatch')
class CrearUsuarioView(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            if cuenta.rol != 'S':
                return JsonResponse({'error': 'No tienes permisos para crear una sucursal'}, status=403)
            data = json.loads(request.body)
            nombre_usuario = data.get('nombreusuario')
            contrasenia = data.get('contrasenia')
            tipo_empleado = data.get('tipo_empleado')
            obs = data.get('observacion')
            correo=data.get('correorecuperacion')

            user = User.objects.create_user(username=nombre_usuario, password=contrasenia)

            cuenta_nueva = Cuenta.objects.create(
                nombreusuario=nombre_usuario,
                contrasenia=make_password(contrasenia),
                estadocuenta='1',
                rol=tipo_empleado,
                observacion=obs,
                correorecuperacion=correo
            )

            # Crear un nuevo empleado según el tipo especificado
            if tipo_empleado == 'X':
                empleado_nuevo = JefeCocina.objects.create(
                    id_sucursal=Sucursales.objects.get(id_sucursal=data.get('id_sucursal')),
                    id_administrador=Administrador.objects.get(id_administrador=1),
                    nombre=data.get('nombre'),
                    apellido=data.get('apellido'),
                    telefono=data.get('telefono'),
                    id_cuenta=cuenta_nueva
                )
            elif tipo_empleado == 'M':
                empleado_nuevo = Mesero.objects.create(
                    id_sucursal=Sucursales.objects.get(id_sucursal=data.get('id_sucursal')),
                    id_administrador=Administrador.objects.get(id_administrador=1),
                    telefono=data.get('telefono'),
                    apellido=data.get('apellido'),
                    nombre=data.get('nombre'),
                    id_cuenta=cuenta_nueva
                )
            elif tipo_empleado == 'D':
                empleado_nuevo = Motorizado.objects.create(
                    id_sucursal=Sucursales.objects.get(id_sucursal=data.get('id_sucursal')),
                    id_administrador=Administrador.objects.get(id_administrador=1),
                    nombre=data.get('nombre'),
                    apellido=data.get('apellido'),
                    telefono=data.get('telefono'),
                    id_cuenta=cuenta_nueva
                )
            else:
                # Si el tipo de empleado no es reconocido, puedes manejarlo según tus necesidades
                raise ValueError('Tipo de empleado no válido')

            return JsonResponse({'mensaje': 'Usuario y empleado creado con éxito'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
