# Generated by Django 3.0.5 on 2022-06-22 11:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_sach_biasach'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sach',
            name='biaSach',
            field=models.ImageField(default=None, null=True, upload_to='sach'),
        ),
    ]
