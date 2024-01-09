from django.db import models
from Sucursal.models import Sucursales
from Cliente.models import Cuenta

# Create your models here.
class Administrador(models.Model):
    id_administrador = models.AutoField(primary_key=True)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    apellido = models.CharField(max_length=300)
    nombre = models.CharField(max_length=300)
    id_cuenta= models.ForeignKey(Cuenta, on_delete=models.CASCADE, db_column='id_cuenta')
    id_sucursal = models.ForeignKey(Sucursales, on_delete=models.CASCADE, db_column='id_sucursal',null=True)

    class Meta:
        managed = False
        db_table = 'administrador'