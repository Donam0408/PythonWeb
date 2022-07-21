from dataclasses import field
from pickle import FALSE
from pyexpat import model
from django import forms
from django.contrib.admin import widgets
from .models import DocGia, MuonTraSach, Sach
from django.db.models import fields
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User

from django.contrib.admin.widgets import AdminDateWidget, AdminTimeWidget,AdminSplitDateTime,AdminRadioSelect
class NhapDocGiaForm(forms.ModelForm):
     class Meta:
         model = DocGia
         fields =  '__all__'
         widgets = {
             'ngaySinh' : AdminDateWidget(attrs={'type': 'date'}),
             
             }
         
class NhapSachForm(forms.ModelForm):
     class Meta:
         model = Sach
         fields =  '__all__'
        
class MuonTraSachForm(forms.ModelForm):
     class Meta:
         model = MuonTraSach
         fields =  '__all__'
         widgets = {
             'ngayMuon' : AdminDateWidget(attrs={'type': 'date'} ), 
             'ngayHenTra' : AdminDateWidget(attrs={'type': 'date'}),
             'ngayTra' : AdminDateWidget(attrs={'type': 'date'}),
             
             }
class RegisterForm(forms.Form):
        username = forms.CharField(max_length= 50)
        email = forms.EmailField(max_length=50)
        password = forms.CharField(max_length=50,widget= forms.PasswordInput)
    
class LoginForm(forms.Form):
    username = forms.CharField(max_length= 50)
    password = forms.CharField(max_length=50,widget= forms.PasswordInput)
    
class PasswordChangingForm(PasswordChangeForm):
    old_password = forms.CharField(max_length=50,widget= forms.PasswordInput(attrs={'class': 'form-control', 'type': 'password'}), label="Mật khẩu cũ")
    new_password1 = forms.CharField(max_length=50,widget= forms.PasswordInput(attrs={'class': 'form-control', 'type': 'password'}),label="Nhập mật khẩu mới")
    new_password2 = forms.CharField(max_length=50,widget= forms.PasswordInput(attrs={'class': 'form-control', 'type': 'password'}),label="Xác nhận mật khẩu mới")
    class Meta:
        model = User
        field = ('old_password','new_password1','new_password2')