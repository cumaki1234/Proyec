from django.db import models
from horariossemanales.models import Horariossemanales
from GeoSector.models import Geosectores
from Empresa.models import Empresa
from Ubicaciones.models import Ubicaciones
from Login.models import Cuenta

# Create your models here.
class Sucursales(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    srazon_social = models.CharField(max_length=300)
    sruc = models.CharField(max_length=20)
    sestado = models.CharField(max_length=1)
    scapacidad = models.CharField(max_length=1, blank=True, null=True)
    scorreo = models.CharField(max_length=300)
    stelefono = models.CharField(max_length=300, blank=True, null=True)
    sdireccion = models.CharField(max_length=300)
    snombre = models.CharField(max_length=300, blank=True, null=True)
    fsapertura = models.DateTimeField(auto_now_add=True)
    id_horarios = models.ForeignKey(Horariossemanales, on_delete=models.CASCADE, db_column='id_horarios')
    id_geosector = models.ForeignKey(Geosectores, models.DO_NOTHING, db_column='id_geosector', blank=True, null=True)
    firmaelectronica = models.BinaryField(blank=True, null=True)
    id_empresa = models.ForeignKey(Empresa, models.DO_NOTHING, db_column='id_empresa')
    id_ubicacion = models.ForeignKey(Ubicaciones, models.DO_NOTHING, db_column='id_ubicacion', blank=True, null=True)
    imagensucursal = models.BinaryField(blank=True, null=True)
    id_cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE, db_column='id_cuenta')

    class Meta: 
        managed = False
        db_table = 'sucursales'

