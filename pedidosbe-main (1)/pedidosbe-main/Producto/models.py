from django.db import models

class TiposProductos(models.Model):
    id_tipoproducto = models.AutoField(primary_key=True)
    tpnombre = models.CharField(max_length=300, null=False)
    descripcion = models.CharField(max_length=500, null=True)
    class Meta: 
        managed = False
        db_table = 'tiposproductos'
class Categorias(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    imagencategoria = models.BinaryField(null=True)
    id_tipoproducto = models.ForeignKey(TiposProductos, on_delete=models.CASCADE, db_column='id_tipoproducto')
    catnombre = models.CharField(max_length=300, null=False)
    descripcion = models.CharField(max_length=500, null=True)
    class Meta: 
        managed = False
        db_table = 'categorias'
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey('Categorias', on_delete=models.CASCADE, db_column='id_categoria')
    id_um = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE,db_column='id_um')
    imagenp = models.BinaryField(null=True)
    puntosp = models.DecimalField(max_digits=3, decimal_places=0,default=0)
    codprincipal = models.CharField(max_length=25, null=True)
    nombreproducto = models.CharField(max_length=300)
    descripcionproducto = models.CharField(max_length=300, null=True, blank=True)
    preciounitario = models.DecimalField(max_digits=14, decimal_places=2)
    iva = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    ice = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    irbpnr = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)

    class Meta:
        managed = False
        db_table = 'producto'
class UnidadMedida(models.Model):
    idum = models.AutoField(primary_key=True)
    nombreum = models.CharField(max_length=100, null=False)

    class Meta:
        managed = False
        db_table = 'unidadmedida'