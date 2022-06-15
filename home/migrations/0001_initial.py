# Generated by Django 3.0.5 on 2022-05-22 10:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DocGia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maDG', models.CharField(max_length=50)),
                ('tenDG', models.CharField(max_length=100)),
                ('ngaySinh', models.DateField(null=True)),
                ('gioiTinh', models.CharField(choices=[('Nữ', 'Nữ'), ('Nam', 'Nam'), ('Không xác định', 'Không xác định')], default='Nữ', max_length=50)),
                ('SDT', models.CharField(max_length=100)),
                ('diaChi', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='MuonTraSach',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maDG', models.CharField(max_length=100)),
                ('maSach', models.CharField(max_length=100)),
                ('ngayMuon', models.DateField(auto_now_add=True)),
                ('ngayHenTra', models.DateField()),
                ('ngayTra', models.DateField(blank=True, null=True)),
                ('trangThai', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Sach',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maSach', models.CharField(max_length=50)),
                ('tenSach', models.CharField(max_length=100)),
                ('loaiSach', models.CharField(max_length=50)),
                ('tenTG', models.CharField(max_length=100)),
                ('nhaXB', models.CharField(max_length=100)),
                ('namXB', models.IntegerField(blank=True)),
                ('trangThaiSach', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='TaiKhoan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tK', models.CharField(max_length=50)),
                ('mk', models.CharField(max_length=50)),
            ],
        ),
    ]
