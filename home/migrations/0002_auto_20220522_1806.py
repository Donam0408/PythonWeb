# Generated by Django 3.0.5 on 2022-05-22 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='muontrasach',
            name='ngayMuon',
            field=models.DateField(),
        ),
    ]
