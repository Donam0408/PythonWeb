from unicodedata import name
from xml.dom.minidom import Document
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('Test/', views.Test),
    #path('postDocGia/', views.postDocGia),
    
    path('ListDocGia/', views.ListDocGia, name= "ListDocGia"),
    path('SaveDocGia/', views.ThemDocGia.as_view(), name= "saveDG"),
    path('get/ajax/validate/nickname', views.checkNickName, name = "validate_nickname"),
    path('FindDocGia/',views.TimDocGia.as_view(),name="find_dg"),
    path('DeleteDocGia/',views.XoaDocGia.as_view(),name="xoaDG_index"),
    path('delete_DG/<int:id>',views.delete_docgia, name='deleteDG'),
    path('AlterDocGia/',views.SuaDocGia.as_view(),name='alterDG'),
    path('AddSach/', views.AddSach.as_view(),name= "saveSach"),
    path('get/ajax/validate/sach', views.checkSach, name = "validate_sach"),
    path('get/ajax/validate/sach2', views.checkSach2, name = "validate_sach2"),
    path('ListSach/', views.ListSach,name= "ListSach"),
    path('FindSach/',views.FindSach.as_view(),name= "FindSach"),
    path('FindSachByName/',views.FindSachByName,name= "FindSachByName"),
    path('DeleteSach/',views.XoaSach.as_view(),name= "XoaSach"),
    path('AlterSach/',views.SuaSach.as_view(),name='alterSach'),
    path('delete_S/<int:id>',views.delete_sach, name='deleteSach'),
    path('inf_sach/<int:id>',views.infor_sach, name='infSach'),
    path('get/ajax/validate/pms', views.checkPMS, name = "validate_pms"),
    path('ListPMS/', views.ListPMS,name = "ListPMS"),
    path('ListPMS2/', views.ListPMS2,name = "ListPMS2"),
    
    path('TraSach/', views.TraSach.as_view(),name='traSach'),
    path('AddPhieuMuonSach/',views.AddPhieuMuonSach.as_view(),name="AddPhieuMuonSach"),
    path('Register/',views.registerUser.as_view(),name= "registerUser"),
    path('get/ajax/validate/user', views.checkUser, name = "validate_user"),
    path('Login/',views.loginUser.as_view(),name= "loginUser"),
    path('Logout/',views.logoutUser,name= "logoutUser"),
    path('ChangePassword/',views.changePassword.as_view(),name= "changePassword"),
    path('Trangchu/',views.mainlib,name= "mainlib"),
   
    
] 
urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

