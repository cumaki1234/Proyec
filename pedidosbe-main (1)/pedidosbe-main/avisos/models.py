from django.db import models
from Empresa.models import Empresa

class AvisosPrincipales(models.Model):
    id_aviso = models.AutoField(primary_key=True)
    id_empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, db_column="id_empresa")
    titulo = models.CharField(max_length=150)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    imagen = models.BinaryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'avisosprincipales'