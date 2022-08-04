from ast import mod
from random import choices
from django.db import models
from multiselectfield import MultiSelectField
from django.contrib.auth.models import User

# Create your models here.
class DocGia(models.Model):
    maDG = models.CharField(max_length=50)
    tenDG = models.CharField(max_length=100)
    ngaySinh = models.DateField()
    ngaySinh = models.DateField(null=True)
    #time = models.TimeField(null=True)
    sex_choice = (("Nữ", "Nữ"),("Nam","Nam"),('Không xác định','Không xác định'))
    #char_choice = (('Gay','Gay'),('Ngáo','Ngáo'),('Đbrrr','Đbrrr'))
    gioiTinh = models.CharField(choices = sex_choice,max_length=50,default='Nữ')
    #gioiTinh = MultiSelectField(choices =sex_choice,default='Nữ' )
    SDT = models.CharField(max_length=100)
    diaChi = models.CharField(max_length=100)
    def __str__(self):
        return self.tenDG
    
class Sach(models.Model):
    maSach = models.CharField(max_length=50 )
    tenSach = models.CharField(max_length=100)
    loaiSach = models.CharField(max_length=50)
    tenTG = models.CharField(max_length=100)
    nhaXB = models.CharField(max_length=100)
    namXB = models.IntegerField(blank= True)
    trangThaiSach = models.BooleanField(default=True)
    biaSach = models.ImageField(upload_to='images',default = None,null = True)
    def __str__(self):
        return self.maSach
class TaiKhoan(models.Model):
    tK = models.CharField(max_length=50)
    mk = models.CharField(max_length=50)
    
    
class MuonTraSach(models.Model):
    maDG = models.CharField(max_length=100)
    maSach = models.CharField(max_length=100)
    ngayMuon = models.DateField()
    ngayHenTra = models.DateField()
    ngayTra = models.DateField(blank= True,null=True)
    trangThai = models.BooleanField(default=False)
    created_by = models.ForeignKey(User,null=True,on_delete=models.CASCADE)

