# Generated by Django 3.0.5 on 2022-06-17 03:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_auto_20220611_1515'),
    ]

    operations = [
        migrations.AlterField(
            model_name='muontrasach',
            name='ngayHenTra',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='muontrasach',
            name='ngayMuon',
            field=models.DateField(),
        ),
    ]
