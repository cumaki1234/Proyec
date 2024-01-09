from django.db import models
from Producto.models import Producto

class CategoriasCombos(models.Model):
    id_catcombo = models.AutoField(primary_key=True)
    imagencategoria = models.BinaryField(null=True)
    catnombre = models.CharField(max_length=300, null=False)
    descripcion = models.CharField(max_length=500, null=True)

    class Meta:
        managed = False
        db_table = 'categoriascombos'

class Combo(models.Model):
    id_combo = models.AutoField(primary_key=True)
    id_catcombo = models.ForeignKey(CategoriasCombos, on_delete=models.CASCADE, db_column='id_catcombo')
    imagenc = models.BinaryField(null=True)
    puntoscb = models.DecimalField(max_digits=3, decimal_places=0, null=True)
    codprincipal = models.CharField(max_length=25, null=False)
    nombrecb = models.CharField(max_length=300, null=True)
    descripcioncombo = models.CharField(max_length=300, null=True)
    preciounitario = models.DecimalField(max_digits=14, decimal_places=2, null=False)
    iva = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    ice = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    irbpnr = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)

    class Meta:
        managed = False
        db_table = 'combo'
class DetalleCombo(models.Model):
    id_detallecombo = models.AutoField(primary_key=True)
    id_combo = models.ForeignKey(Combo, on_delete=models.CASCADE, db_column='id_combo')
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE, db_column='id_producto')
    cantidad = models.IntegerField()
    class Meta:
        managed = False
        db_table = 'detallecombo'
