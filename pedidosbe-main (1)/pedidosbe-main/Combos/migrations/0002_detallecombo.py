# Generated by Django 5.0 on 2024-01-04 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Combos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DetalleCombo',
            fields=[
                ('id_detallecombo', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField()),
            ],
            options={
                'db_table': 'detallecombo',
                'managed': False,
            },
        ),
    ]
