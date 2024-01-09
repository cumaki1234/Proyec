from django.db import models
from Administrador.models impor Administrador

# Create your models here.
class Mesas(models.Model):
    ESTADO_CHOICES = [('D', 'D'), ('R', 'R'), ('U', 'U'), ('A', 'A')]
    ACTIVA_CHOICES = [('0', '0'), ('1', '1')]

    id_mesa = models.AutoField(primary_key=True)
    id_administrador = models.ForeignKey(Administrador, on_delete=models.CASCADE,db_column='id_administrador')
    observacion = models.CharField(max_length=500, null=True, blank=True)
    estado = models.CharField(max_length=1, choices=ESTADO_CHOICES, default='D')
    activa = models.CharField(max_length=1, choices=ACTIVA_CHOICES, default='0')
    maxpersonas = models.SmallIntegerField()
    class Meta:
        managed = False
        db_table = 'mesas'