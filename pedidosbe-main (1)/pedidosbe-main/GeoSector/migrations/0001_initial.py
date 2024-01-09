# Generated by Django 5.0 on 2023-12-24 06:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Geosectores',
            fields=[
                ('id_geosector', models.AutoField(primary_key=True, serialize=False)),
                ('fechacreaciong', models.DateTimeField()),
                ('secnombre', models.CharField(max_length=300)),
                ('secdescripcion', models.CharField(blank=True, max_length=500, null=True)),
                ('sectipo', models.CharField(max_length=1)),
                ('secestado', models.CharField(max_length=1)),
                ('tarifa', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
            ],
            options={
                'db_table': 'geosectores',
                'managed': False,
            },
        ),
    ]
