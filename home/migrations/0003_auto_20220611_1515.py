# Generated by Django 3.0.5 on 2022-06-11 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_auto_20220522_1806'),
    ]

    operations = [
        migrations.AlterField(
            model_name='muontrasach',
            name='ngayHenTra',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='muontrasach',
            name='ngayMuon',
            field=models.DateField(blank=True),
        ),
    ]
