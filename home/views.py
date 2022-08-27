
from asyncio.windows_events import NULL
from collections import UserList
from datetime import date, datetime


from pickle import FALSE, TRUE
from urllib import response
from wsgiref.handlers import format_date_time
from django import views
import django
from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.urls import reverse, reverse_lazy
from requests import request
from rest_framework.parsers import JSONParser 
from rest_framework import status
from rest_framework.views import APIView
from django.core import serializers
from home.models import DocGia, Sach, TaiKhoan, MuonTraSach
from home.serializers import DocGiaSerializers,MuonTraSachSerializers
from home.form import MuonTraSachForm, NhapDocGiaForm,NhapSachForm,RegisterForm,LoginForm,PasswordChangingForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin,UserPassesTestMixin

from rest_framework.decorators import api_view, renderer_classes
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie

from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth import authenticate,login,logout,load_backend

#
from django.views import View
import pymongo
from django.conf import settings
my_client = pymongo.MongoClient('mongodb://localhost:27017')
dblist = my_client.list_database_names()
pythonweb = my_client['PythonWeb']
docgia = pythonweb['home_docgia']
# Create your views here.
import logging
logger = logging.getLogger(__name__)

from home.decorator import admin_only, role_required,admin_only2
from django.utils.decorators import method_decorator      

# Doc Gia API-------------------------------------------------------------------------------------------------------------------------------
# Hiển thị danh sách đọc giả
@login_required(login_url = 'loginUser')
@admin_only
def ListDocGia(request):   
        if request.method == 'GET':
         docgia = DocGia.objects.all().values()
        return render(request, "home/DetailDocGia.html", {'ds' : docgia})
# Thêm đọc giả

class ThemDocGia(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
         
 def get(self, request):
        form = NhapDocGiaForm()
        return render(request, "home/FormAddDocGia.html",{'form':form})
 def post(self, request):
  if request.is_ajax and request.method == "POST":
        docgia_data =  NhapDocGiaForm(request.POST)
        if docgia_data.is_valid():          
                docgia_data.save()
                return JsonResponse({"valid":False}, status=200)    
        return JsonResponse({"error": docgia_data.errors}, status=400)
 def test_func(self):
        return self.request.user.is_superuser
def checkNickName(request):
    # request should be ajax and method should be GET.
    if request.is_ajax and request.method == "GET":
        # get the nick name from the client side.
        maDG = request.GET.get("maDG", None)
        # check for the nick name in the database.
        if DocGia.objects.filter(maDG = maDG ).exists():
            # if nick_name found return not valid new friend
            return JsonResponse({"valid":False}, status = 200)
        else:
            # if nick_name not found, then user can create a new friend.
            return JsonResponse({"valid":True}, status = 200)

    return JsonResponse({}, status = 400)        
                

def __str__(self):
        pass




'''
@csrf_exempt
def postDocGia(request):
        if request.method == 'POST':
            docgia_data = JSONParser().parse(request)
            docgia_serializer = DocGiaSerializers(data=docgia_data)
            if docgia_serializer.is_valid():
                docgia_serializer.save()
                return JsonResponse(docgia_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(docgia_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''

'''def Test(request):
 if request.method == 'POST':
        FindmaDG = request.POST.get('maDG')   
        FindDGbyName = docgia.find_one({"maDG": FindmaDG})
 return render(request,"home/DetailOneDocGia.html", {'dg' : FindDGbyName})
 
if request.method == "POST":
        orders = Order()
        orders.data = request.POST.get("data")
        orders.time = request.POST.get("time")
        st = request.POST.get("status")
        if st == 'on':
                st = True
        else:
                st = False
        orders.status = st
 '''
# Tìm đọc giả
class TimDocGia(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
 def get(self, request): 
        form = NhapDocGiaForm()
        return render(request, "home/FormTimDocGia.html",{'form':form})
 def post(self, request):
      if request.is_ajax and request.method == "POST":
        # get the nick name from the client side.
        maDG = request.POST.get("maDG", None)
        # check for the nick name in the database.
        if DocGia.objects.filter(maDG = maDG).exists():
            instance = DocGia.objects.get(maDG = maDG)    
            ser_instance = serializers.serialize('json', [ instance, ])
            return JsonResponse({"valid":True,"instance": ser_instance}, status=200)    
        else:
         return JsonResponse({"valid":False}, status = 200)
 def test_func(self):
        return self.request.user.is_superuser  
 

# Xóa đọc giả
class XoaDocGia(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
 def get(self, request): 
        form = NhapDocGiaForm()
        docgia = DocGia.objects.all().values()
        return render(request, "home/FormXoaDocGia.html",{'form':form,'ds' : docgia})

 def post(self, request):
        FindmaDG = request.POST.get('maDG')
        try:
                FindDGbyName = DocGia.objects.get(maDG = FindmaDG)          
        except:
                return HttpResponse("Không tìm thấy đọc giả")
        
        if FindDGbyName:
               FindDGbyName.delete()
               return HttpResponseRedirect(reverse('xoaDG_index')) 
 def test_func(self):
        return self.request.user.is_superuser  
# Xóa đọc giả dùng danh sách
@login_required(login_url = 'loginUser')
@admin_only
def delete_docgia(request,id): 
 if request.is_ajax and request.method == "GET":
        docgia_data = DocGia.objects.get(id=id)        
        docgia_data.delete() 
        return JsonResponse({"message":'success'}, status=200)
 return JsonResponse({"message":'Wrong route'}, status=200)
# Sửa thông tin đọc giả
@login_required(login_url = 'loginUser')
@admin_only
def Sua_DG(request,id):
        data = DocGia.objects.get(id=id)
        return render(request, "home/FormSuaDocGia.html",{'data':data})
class SuaDocGia(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
 def get(self, request):
        form = DocGia.objects.all()
        return render(request, "home/ListSua_DG.html",{'ds':form})

 def post(self, request):
       if request.is_ajax and request.method == "POST":
        # get the nick name from the client side.
        maDG = request.POST.get("maDG", None)
        tenDG = request.POST.get("tenDG", None)
        ngaySinh = request.POST.get("ngaySinh", None)
        gioiTinh = request.POST.get("gioiTinh", None)
        SDT = request.POST.get("SDT", None)
        diaChi = request.POST.get("diaChi", None)        
        if DocGia.objects.filter(maDG = maDG).exists():
                docgia = DocGia.objects.get(maDG = maDG)
                
                if tenDG.strip():
                 docgia.tenDG = tenDG
                if ngaySinh.strip():
                 docgia.ngaySinh = ngaySinh
                if gioiTinh.strip():
                 docgia.gioiTinh = gioiTinh
                if SDT.strip():
                 docgia.SDT = SDT
                if diaChi.strip():
                 docgia.diaChi = diaChi
                 
                docgia.save()
                return JsonResponse({"valid":True}, status=200)  
        else:
                return JsonResponse({"valid":False}, status = 200)  
 def test_func(self):
        return self.request.user.is_superuser 
                
#Sách API----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#check Sach:

def checkSach(request):
    # request should be ajax and method should be GET.
    if request.is_ajax and request.method == "GET":
        # get the nick name from the client side.
        maSach = request.GET.get("maSach", None)
        # check for the nick name in the database.
        if Sach.objects.filter(maSach = maSach ).exists():
            # if nick_name found return not valid new friend
            return JsonResponse({"valid":False}, status = 200)
        else:
            # if nick_name not found, then user can create a new friend.
            return JsonResponse({"valid":True}, status = 200)

    return JsonResponse({}, status = 400)   
def checkSach2(request):
    if request.is_ajax and request.method == "POST":
        maSach = request.POST.get("maSach", None)
        if Sach.objects.filter(maSach = maSach ).exists():
            instance = Sach.objects.get(maSach = maSach)
            if instance.trangThaiSach ==True: 
                    return JsonResponse({"valid":True, "mess": 1}, status=200)  
            return JsonResponse({"valid":True}, status=200)
        else:
            # if nick_name not found, then user can create a new friend.
            return JsonResponse({"valid":False}, status = 200)

    return JsonResponse({}, status = 400)     
# Danh sách sách:
@login_required(login_url = 'loginUser')
def infor_sach(request,id):
         sach_data = Sach.objects.get(id = id)
         return render(request, "home/DetailOneSach.html", {'ds' : sach_data})
 
@login_required(login_url = 'loginUser')
def SachCNTT(request):
        if request.method == 'GET':
                sachcntt = Sach.objects.filter(loaiSach__icontains = 'CNTT',trangThaiSach = False)
                return render(request, "home/SachCNTT.html", {'cntt' : sachcntt})
@login_required(login_url = 'loginUser')
def SachDC(request):
        if request.method == 'GET':
                sachdc = Sach.objects.filter(loaiSach__icontains = "Đại Cương",trangThaiSach = False)
                return render(request, "home/SachDC.html", {'dc' : sachdc})
@login_required(login_url = 'loginUser')
def SachATTT(request):
        if request.method == 'GET':
                sachattt = Sach.objects.filter(loaiSach__icontains = 'ATTT',trangThaiSach = False)
                return render(request, "home/SachATTT.html", {'attt' : sachattt})
@login_required(login_url = 'loginUser')
def SachTK(request):
        if request.method == 'GET':
                sachtk= Sach.objects.filter(loaiSach__icontains = 'Tham Khảo',trangThaiSach = False)
                return render(request, "home/SachTK.html", {'thamkhao' : sachtk})
@login_required(login_url = 'loginUser')
def SachGT(request):
        if request.method == 'GET':
                sachtruyen= Sach.objects.filter(loaiSach__icontains = 'Giải Trí',trangThaiSach = False)
                return render(request, "home/SachGT.html", {'giaitri':sachtruyen})
@login_required(login_url = 'loginUser')
def SachDTVT(request):
        if request.method == 'GET':
                sachdtvt= Sach.objects.filter(loaiSach__icontains = 'DTVT',trangThaiSach = False)
                return render(request, "home/SachDTVT.html", {'sachdtvt':sachdtvt})

        
@login_required(login_url = 'loginUser')
@admin_only
def ListSach(request):
        if request.method == 'GET':
                sachdc = Sach.objects.filter(loaiSach__icontains = "Đại Cương")
                sachattt = Sach.objects.filter(loaiSach__icontains = 'ATTT')
                sachcntt = Sach.objects.filter(loaiSach__icontains = 'CNTT')
                sachdtvt = Sach.objects.filter(loaiSach__icontains = 'DTVT')
                sachtk= Sach.objects.filter(loaiSach__icontains = 'Tham Khảo')
                sachtruyen= Sach.objects.filter(loaiSach__icontains = 'Giải Trí')
                
                return render(request, "home/DetailSach.html", {'dc' : sachdc,'attt' : sachattt,'cntt' : sachcntt,'thamkhao' : sachtk,'giaitri':sachtruyen,'dtvt':sachdtvt})
                
# Thêm Sách
class AddSach(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
 def get(self, request):
         form = NhapSachForm()
         return render(request, "home/FormAddSach.html",{'form':form})
 def post(self, request):
        '''request.is_ajax and'''
        if request.method == "POST": 
         sach_data = NhapSachForm(request.POST,request.FILES)
         if sach_data.is_valid():       
                sach_data.save()
                return JsonResponse({"valid":False}, status=200) 
         else:
                return JsonResponse({"error": sach_data.errors}, status=400)  
 def test_func(self):
        return self.request.user.is_superuser            
# Tìm Sách
class FindSach(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
 def get(self,request):
         form = NhapSachForm()
         return render(request, "home/FormTimSach.html",{'form':form})  
 def post(self,request):    
        if request.is_ajax and request.method == "POST":
        # get the nick name from the client side.
                maSach = request.POST.get("maSach", None)
        # check for the nick name in the database.
        if Sach.objects.filter(maSach = maSach).exists():
            instance = Sach.objects.get(maSach = maSach)    
            ser_instance = serializers.serialize('json', [ instance, ])
            return JsonResponse({"valid":True,"instance": ser_instance}, status=200)    
        else:
         return JsonResponse({"valid":False}, status = 200) 
 def test_func(self):
        return self.request.user.is_superuser 
#Sửa thông tin sách  
class SuaSach(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
 def get(self, request): 
        form = NhapSachForm()
        sach = Sach.objects.all().values()
        return render(request, "home/FormSuaSach.html",{'form':form,'ds' : sach})
 def post(self, request):
        
        if request.is_ajax and request.method == "POST":
        # get the nick name from the client side.
                maSach = request.POST.get("maSach", None)
                tenSach = request.POST.get("tenSach", None)
                tenTG = request.POST.get("tenTG", None)
                loaiSach = request.POST.get("loaiSach", None)
                nhaXB = request.POST.get("nhaXB", None)
                namXB = request.POST.get("namXB", None)  
                trangThaiSach = request.POST.get("trangThaiSach", None)
                
        if Sach.objects.filter(maSach = maSach).exists():
                sach = Sach.objects.get(maSach = maSach)
                if tenSach.strip():
                        sach.tenSach = tenSach
                if tenTG.strip():
                        sach.tenTG = tenTG
                if loaiSach.strip():
                        sach.loaiSach = loaiSach
                if nhaXB.strip():
                        sach.nhaXB = nhaXB
                if namXB.strip():
                        sach.namXB = namXB
                try:
                        biaSach = request.FILES['biaSach']  
                        sach.biaSach = biaSach     
                except:
                        pass
                
                if trangThaiSach == '0':
                        sach.trangThaiSach = False
                elif trangThaiSach == '1':
                        sach.trangThaiSach = True
                        
                sach.save()
                return JsonResponse({"valid":True}, status=200)  
        else:
                return JsonResponse({"valid":False}, status = 200) 
 def test_func(self):
        return self.request.user.is_superuser 
#Xóa sách theo mã sách
class XoaSach(LoginRequiredMixin,UserPassesTestMixin,View):
 login_url = 'loginUser'
 def get(self, request): 
        form = NhapSachForm()
        sach = Sach.objects.all().values()
        return render(request, "home/FormXoaSach.html",{'form':form,'ds' : sach})
 def post(self, request):  
        FindSach_id = request.POST.get('maSach')       
        try:
                FindSach_data = Sach.objects.get(maSach = FindSach_id)             
        except:
                return HttpResponse("Không tìm thấy sách")
        if FindSach_data:
               FindSach_data.delete()
               return HttpResponseRedirect(reverse('XoaSach'))   
 def test_func(self):
        return self.request.user.is_superuser       
# Xóa Sách theo danh sách
@login_required(login_url = 'loginUser')
@admin_only
def delete_sach(request,id):
 if request.is_ajax and request.method == "GET":
        sach = Sach.objects.get(id=id)        
        sach.delete() 
        return JsonResponse({"mess":'success'}, status=200)
 else:
        return JsonResponse({"mess":'Wrong route'}, status=200)                         
#--------------------------------------------------------------------------------------------------------------------------------------------------- 
# Hiển thị phiếu mượn sách
@login_required(login_url = 'loginUser')
@admin_only
def ListPMS(request):
        pms =  MuonTraSach.objects.filter(trangThai= False)
        return render(request, "home/DetailPMS.html",{'ds':pms})  
@login_required(login_url = 'loginUser')
@admin_only
def ListPMS2(request):
        pms =  MuonTraSach.objects.all()
        return render(request, "home/DetailPMS2.html",{'ds':pms}) 
@login_required(login_url = 'loginUser')
def ListPMS_DG(request):
        pms =  MuonTraSach.objects.filter(trangThai= False)
        ds = []
        for x in pms:
                if x.created_by == request.user:
                        ds.append(x)
        return render(request, "home/DetailPMS_DG.html",{'ds':ds}) 
@login_required(login_url = 'loginUser')
def ListPMS_DG2(request):
        pms =  MuonTraSach.objects.all()
        ds = []
        for x in pms:
                if x.created_by == request.user:
                        ds.append(x)
        return render(request, "home/DetailPMS_DG2.html",{'ds':ds}) 
 
#Check PMS
def checkPMS(request):
    # request should be ajax and method should be GET.
    if request.is_ajax and request.method == "GET":
        # get the nick name from the client side.
        maDG = request.GET.get("maDG", None)
        # check for the nick name in the database.
        if MuonTraSach.objects.filter(maDG = maDG,trangThai = False).exists():
            # if nick_name found return not valid new friend
            return JsonResponse({"valid":False}, status = 200)
        else:
            # if nick_name not found, then user can create a new friend.
            return JsonResponse({"valid":True}, status = 200)
    
# Thêm phiếu mượn sách
class AddPhieuMuonSach(LoginRequiredMixin,View):
 login_url = 'loginUser'
 def get(self, request):
        form = MuonTraSachForm()
        return render(request, "home/FormAddPhieuMuonSach.html",{'form':form})         
 def post(self, request):
  if request.is_ajax and request.method == "POST":
        maSach = request.POST.get("maSach", None)
        maDG = request.POST.get("maDG", None)
        ngayHenTra = request.POST.get("ngayHenTra", None)
        format = '%Y-%m-%d'
        ngayMuon = datetime.today()
        ngayHenTra_date = datetime.strptime(ngayHenTra, format)
        owner = request.user
        sach = Sach.objects.get(maSach = maSach)
        if(ngayHenTra_date >= ngayMuon):
                 sach.trangThaiSach = True
                 sach.save() 
                 pms = MuonTraSach.objects.create(maDG =maDG,maSach=maSach,ngayMuon=ngayMuon,ngayHenTra=ngayHenTra,trangThai=False,created_by = owner)
                 pms.save()
                 return JsonResponse({"valid":False}, status=200) 
        return JsonResponse({"valid":True}, status=200)   
from datetime import date
class AddPMS_DG(LoginRequiredMixin,View):
 login_url = 'loginUser'
 def get(self, request):
        form = MuonTraSachForm()
        return render(request, "home/FormAddPMS_DG.html",{'form':form})         
 def post(self, request):
  if request.is_ajax and request.method == "POST":
        maSach = request.POST.get("maSach", None)
        maDG = request.POST.get("maDG", None)
        ngayHenTra = request.POST.get("ngayHenTra", None)
        format = '%Y-%m-%d'
        ngayMuon = datetime.today()
        ngayHenTra_date = datetime.strptime(ngayHenTra, format)
        owner = request.user
        sach = Sach.objects.get(maSach = maSach)
        if(ngayHenTra_date >= ngayMuon):
                 sach.trangThaiSach = True
                 sach.save() 
                 pms = MuonTraSach.objects.create(maDG =maDG,maSach=maSach,ngayMuon=ngayMuon,ngayHenTra=ngayHenTra,trangThai=False,created_by = owner)
                 pms.save()
                 return JsonResponse({"valid":False}, status=200) 
        return JsonResponse({"valid":True}, status=200)   
# Trả sách 
def TraSach_id(request,id):
        form = MuonTraSachForm()
        pms = MuonTraSach.objects.get(id=id)
        return render(request, "home/FormTraSach.html",{'form':form,'data':pms})


class timTraSach(LoginRequiredMixin,View):
 login_url = 'loginUser'
 def get(self, request):
        form = MuonTraSachForm()
        pms = MuonTraSach.objects.all()
        return render(request, "home/FormTimTraSach.html",{'form':form, 'ds':pms})
 def post(self, request):
  if request.method == "POST":
        pms_data = MuonTraSachForm(request.POST)  
        maDG = request.POST.get("maDG", None)
        try:
                pms = MuonTraSach.objects.filter(maDG__icontains=maDG)    
                return render(request, "home/TimTraSach_result.html",{'ds':pms})
        except:
                return render(request, "home/TimTraSach_result.html",{'ds':pms})
        
                        
class TraSach(LoginRequiredMixin,View):
 login_url = 'loginUser'
 def get(self, request):
        form = MuonTraSachForm()
        pms = MuonTraSach.objects.all()
        return render(request, "home/FormTraSach.html",{'form':form, 'ds':pms})
 def post(self, request):
  if request.is_ajax and request.method == "POST":
   docgia_id = request.POST.get("maDG", None)
   sach_id = request.POST.get("maSach", None)
   ngayTra = request.POST.get("ngayTra", None)
   if MuonTraSach.objects.filter(maSach = sach_id, maDG = docgia_id).exists():       
                pms = MuonTraSach.objects.get(maDG = docgia_id ,maSach = sach_id, trangThai = False)
                format = '%Y-%m-%d'
                ngayTra1 = datetime.strptime(ngayTra, format)
                ngayMuon = pms.ngayMuon
                ngayMuon_str =  date.strftime(ngayMuon,format)
                ngayMuon_date = datetime.strptime(ngayMuon_str, format)
                
                ngayHenTra = pms.ngayHenTra
                ngayHenTra_str =  date.strftime(ngayHenTra,format)
                ngayHenTra_date = datetime.strptime(ngayHenTra_str, format)
                
                if ngayTra1 < ngayMuon_date: 
                    return JsonResponse({"valid":True, "mess": 1}, status=200)  
                if ngayTra1 > ngayHenTra_date:
                        sach = Sach.objects.get(maSach = sach_id)
                        pms.ngayTra = ngayTra
                        pms.trangThai = True
                        pms.save()
                        sach.trangThaiSach = False
                        sach.save()   
                        return JsonResponse({"valid":True, "mess": 2}, status=200)    

                sach = Sach.objects.get(maSach = sach_id)
                pms.ngayTra = ngayTra
                pms.trangThai = True
                pms.save()
                sach.trangThaiSach = False
                sach.save()
                return JsonResponse({"valid":True}, status=200)
   else:
                return JsonResponse({"valid":False}, status=200)
  return JsonResponse({"error": "ERROR"}, status=400)

class TraSach_DG(LoginRequiredMixin,View):
 login_url = 'loginUser'
 def get(self, request):
        form = MuonTraSachForm()
        pms = MuonTraSach.objects.filter(trangThai =False,created_by = request.user)
        #formated_time = pms['ngayMuon']
        #format_date = formated_time.date()
        #pms['ngayMuon'] = format_date
        return render(request, "home/FormTraSach_DG.html",{'form':form, 'ds':pms})
 def post(self, request):
  if request.is_ajax and request.method == "POST":
   docgia_id = request.POST.get("maDG", None)
   sach_id = request.POST.get("maSach", None)
   ngayTra = request.POST.get("ngayTra", None)
   if MuonTraSach.objects.filter(maSach = sach_id, maDG = docgia_id,created_by = self.request.user ).exists():       
                pms = MuonTraSach.objects.get(maDG = docgia_id ,maSach = sach_id, trangThai = False)
                format = '%Y-%m-%d'
                ngayTra1 = datetime.strptime(ngayTra, format)
                
                ngayMuon = pms.ngayMuon
                ngayMuon_str =  date.strftime(ngayMuon,format)
                ngayMuon_date = datetime.strptime(ngayMuon_str, format)
                
                ngayHenTra = pms.ngayHenTra
                ngayHenTra_str =  date.strftime(ngayHenTra,format)
                ngayHenTra_date = datetime.strptime(ngayHenTra_str, format)
                
                if ngayTra1 < ngayMuon_date: 
                    return JsonResponse({"valid":True, "mess": 1}, status=200)  
                if ngayTra1 > ngayHenTra_date:
                        sach = Sach.objects.get(maSach = sach_id)
                        pms.ngayTra = ngayTra
                        pms.trangThai = True
                        pms.save()
                        sach.trangThaiSach = False
                        sach.save()   
                        return JsonResponse({"valid":True, "mess": 2}, status=200)    

                sach = Sach.objects.get(maSach = sach_id)
                pms.ngayTra = ngayTra
                pms.trangThai = True
                pms.save()
                sach.trangThaiSach = False
                sach.save()
                return JsonResponse({"valid":True}, status=200)
   else:
                return JsonResponse({"valid":False}, status=200)
  return JsonResponse({"error": "ERROR"}, status=400)
@login_required(login_url = 'loginUser')
@admin_only
def delete_PMS(request,id):
        if request.is_ajax and request.method == "GET":
                pms_data = MuonTraSach.objects.get(id=id)        
                pms_data.delete() 
                return JsonResponse({"mess":'success'}, status=200)
        return JsonResponse({"mess":'Wrong route'}, status=200)    
class XoaPMS(LoginRequiredMixin,UserPassesTestMixin,View):
 def test_func(self):
        return self.request.user.is_superuser   
 def get(self, request):
        pms =  MuonTraSach.objects.all()
        return render(request, "home/XoaPMS.html",{'ds':pms})  
                  
                
#------------------------------------------------------------------------------------------------------------------------------------------------------------
# Hiện thị sách có thể mượn lên trang chủ
@login_required(login_url = 'loginUser')
def mainlib(request):
        if request.method == 'GET':
                #ds = []
                
                sachdc = Sach.objects.filter(loaiSach__icontains = "Đại Cương", trangThaiSach = False)
                sachattt = Sach.objects.filter(loaiSach__icontains = 'ATTT', trangThaiSach = False)
                sachcntt = Sach.objects.filter(loaiSach__icontains = 'CNTT', trangThaiSach = False)
                sachtk= Sach.objects.filter(loaiSach__icontains = 'Tham Khảo', trangThaiSach = False)
                sachdtvt = Sach.objects.filter(loaiSach__icontains = 'DTVT', trangThaiSach = False)
                sachtruyen= Sach.objects.filter(loaiSach__icontains = 'Giải Trí', trangThaiSach = False)
                
                #pms = MuonTraSach.objects.filter(trangThai = True)
                # for x in pms:
                #         sach_data = Sach.objects.get(maSach = x.maSach)
                #         ds.append(sach_data)
                return render(request, "home/TrangChu.html", {'dc' : sachdc,'attt' : sachattt,'cntt' : sachcntt,'thamkhao' : sachtk,'giaitri':sachtruyen,'dtvt':sachdtvt})
'''def mainlib(request):
        if request.method == 'GET':
                sach = Sach.objects.filter(trangThaiSach = True)
                return render(request, "home/DetailSach.html", {'ds' : sach})
'''                

'''
        FindmaDG = request.POST.get('maDG')        
        docgia = DocGia.objects.get(maDG = FindmaDG)
        docgia.tenDG = request.POST.get('tenDG')
        docgia.ngaySinh = request.POST.get('ngaySinh')
        docgia.gioiTinh = request.POST.get('gioiTinh')
        docgia.SDT = request.POST.get('SDT')
        docgia.diaChi = request.POST.get('diaChi')
'''
def FindSachByName(request):
        if request.method == 'POST':
                bookname = request.POST.get('bookname')
                sach = []
                if bookname.strip():
                        try:
                                sach = Sach.objects.filter(tenSach__icontains = bookname)
                                return  render(request, "home/FindSach_Result.html", {'sach' : sach}) 
                        except:
                                return  render(request, "home/FindSach_Result.html", {'sach' : sach}) 
                return  render(request, "home/FindSach_Result.html", {'sach' : sach}) 
                

                
                   
#------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Đăng kí tk user
class registerUser(View):
 def get(self,request):
        form = RegisterForm()
        return render(request, "home/FormRegisterUser.html", {'form' : form})  
 def post(self,request):
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 =  request.POST.get('password2')
        if password1 == password2:
                try:
                        user = User.objects.create_user(username,email,password1)
                        user.save()
                        return JsonResponse({"valid":False}, status = 200)
                except:
                        return JsonResponse({"valid":True}, status = 200)
        else:
                        return JsonResponse({"valid":True, "mess": 1}, status = 200)
       
#Check user
def checkUser(request):
    # request should be ajax and method should be GET.
    if request.is_ajax and request.method == "GET":
        # get the nick name from the client side.
        username = request.GET.get("username", None)
        # check for the nick name in the database.
        if User.objects.filter(username = username ).exists():
            # if nick_name found return not valid new friend
            return JsonResponse({"valid":False}, status = 200)
        else:
            # if nick_name not found, then user can create a new friend.
            return JsonResponse({"valid":True}, status = 200)      
# Đăng nhập
class loginUser(View):
 def get(self,request):
         form = LoginForm()
         return render(request, "home/FormLoginUser.html", {'form' : form}) 
 def post(self,request):
        username1 = request.POST.get("username", None)
        password1 = request.POST.get("password", None)
        
        
        try:
                user = authenticate(request, username=User.objects.get(email = username1), password=password1)  
        except:        
                user = authenticate(request, username=username1, password=password1)  
        if user is not None:
                login(request, user)
                return JsonResponse({"valid":True}, status = 200)
        # Redirect to a success page.
        else:
                return JsonResponse({"valid":False}, status = 200)  
        # Return an 'invalid login' error message.

# Đăng xuất
def logoutUser(request):
        logout(request)
        return HttpResponseRedirect(reverse('loginUser'))

# Đổi mật khẩu
class changePassword(LoginRequiredMixin,PasswordChangeView):
        login_url = 'loginUser'
        #form_class = PasswordChangeForm
        form_class = PasswordChangingForm
        template_name = 'home/FormChangePW.html'
        success_url = reverse_lazy('mainlib')
 
#Test 
def Test(request):
      if request.method == 'GET':
        DGMS = MuonTraSach.objects.filter(trangThai = True)
   
        #DgMuonTraSach = MuonTraSach.objects.filter(maDG__icontains = "d" and "a") 
        #MuonTraSach_Serializers = MuonTraSachSerializers(DgMuonTraSach, many=True)       
        #docgia_serializer = DocGiaSerializers(docgia, many=True)
        return render(request, "home/TestDG.html", {'ds' : DGMS })
         
        
 