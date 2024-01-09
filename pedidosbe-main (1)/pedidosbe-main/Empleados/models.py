from django.db import models
from Sucursal.models import Sucursales
from Administrador.models import Administrador
from Login.models import Cuenta
class JefeCocina(models.Model):
    id_jefecocina = models.AutoField(primary_key=True)
    id_sucursal = models.ForeignKey(Sucursales, on_delete=models.CASCADE,db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, on_delete=models.CASCADE,db_column='id_administrador')
    nombre = models.CharField(max_length=300)
    apellido = models.CharField(max_length=300)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    id_cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE,db_column='id_cuenta')
    class Meta:
        managed = False
        db_table = 'jefecocina'
class Mesero(models.Model):
    id_mesero = models.AutoField(primary_key=True)
    id_sucursal = models.ForeignKey(Sucursales, on_delete=models.CASCADE,db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, on_delete=models.CASCADE,db_column='id_administrador')
    telefono = models.CharField(max_length=10)
    apellido = models.CharField(max_length=300)
    nombre = models.CharField(max_length=300)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    id_cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE,db_column='id_cuenta')
    class Meta:
        managed = False
        db_table = 'meseros'
class Motorizado(models.Model):
    id_motorizado = models.AutoField(primary_key=True)
    id_sucursal = models.ForeignKey(Sucursales, on_delete=models.CASCADE,db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, on_delete=models.CASCADE,db_column='id_administrador')
    nombre = models.CharField(max_length=300)
    apellido = models.CharField(max_length=300)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    id_cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE,db_column='id_cuenta')
    class Meta:
        managed = False
        db_table = 'motorizados'