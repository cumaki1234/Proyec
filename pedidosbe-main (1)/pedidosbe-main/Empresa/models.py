from django.db import models

class Empresa(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    enombre = models.CharField(max_length=200)
    direccion = models.CharField(max_length=300, blank=True, null=True)
    etelefono = models.CharField(max_length=10, blank=True, null=True)
    correoelectronico = models.CharField(max_length=256, blank=True, null=True)
    fechafundacion = models.DateField()
    sitioweb = models.CharField(max_length=2000, blank=True, null=True)
    eslogan = models.CharField(max_length=300, blank=True, null=True)
    elogo = models.BinaryField(blank=True, null=True)
    edescripcion = models.CharField(max_length=800, blank=True, null=True)
    docmenu = models.BinaryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'empresa'
