from django.db import models

# Create your models here.
class Horariossemanales(models.Model):
    id_horarios = models.AutoField(primary_key=True)
    hordescripcion = models.CharField(max_length=500, blank=True, null=True)
    tipohorario = models.CharField(max_length=1)
    nombreh = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'horariossemanales'