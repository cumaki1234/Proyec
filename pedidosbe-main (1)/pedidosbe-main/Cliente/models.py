from django.db import models

class Cuenta(models.Model):
    id_cuenta = models.AutoField(primary_key=True)
    nombreusuario = models.CharField(max_length=300)
    contrasenia = models.CharField()
    fechacreacion = models.DateTimeField(auto_now_add=True)
    fechafin = models.DateTimeField(null=True, blank=True)
    observacion = models.CharField(max_length=500, null=True, blank=True)
    fotoperfil = models.BinaryField(null=True, blank=True)
    estadocuenta = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')])
    rol = models.CharField(max_length=1, choices=[('A', 'A'), ('C', 'C'), ('X', 'X'), ('M', 'M'), ('D', 'D')])
    correorecuperacion = models.CharField(max_length=256, null=True, blank=True)
    class Meta:
        managed = False
        db_table = 'cuenta'

class Clientes(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    crazon_social = models.CharField(max_length=300, null=True, blank=True)
    ctelefono = models.CharField(max_length=300)
    tipocliente = models.CharField(max_length=2, choices=[('04', '04'), ('05', '05'), ('06', '06'), ('07', '07'), ('08', '08')],null=True)
    cregistro = models.DateTimeField(auto_now_add=True)
    snombre = models.CharField(max_length=300, null=True, blank=True)
    capellido = models.CharField(max_length=300, null=True, blank=True)
    cpuntos = models.DecimalField(max_digits=3, decimal_places=0, default=0) 
    id_ubicacion1 = models.IntegerField(null=True, blank=True)  # Puedes cambiar esto según tus necesidades
    id_ubicacion2 = models.IntegerField(null=True, blank=True)
    id_ubicacion3 = models.IntegerField(null=True, blank=True)
    id_cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE, db_column='id_cuenta')
    ruc_cedula = models.CharField(max_length=300, null=True, blank=True)
    ccorreo_electronico = models.CharField(max_length=300, null=True, blank=True)
    ubicacion = models.CharField(max_length=300, null=True, blank=True)
    class Meta:
        managed = False
        db_table = 'clientes'

class Ubicaciones(models.Model):
    id_ubicacion = models.AutoField(primary_key=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6)
    longitud = models.DecimalField(max_digits=9, decimal_places=6)
    udescripcion = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f'Ubicacion {self.id_Ubicacion}: {self.Latitud}, {self.Longitud}'
    class Meta:
        managed = False
        db_table = 'ubicaciones'
