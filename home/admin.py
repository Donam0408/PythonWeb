from django.contrib import admin
from .models import DocGia,Sach,MuonTraSach,TaiKhoan
# Register your models here.
admin.site.register(DocGia)
admin.site.register(Sach)
admin.site.register(TaiKhoan)
class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created_by',)
    def save_model(self, request, obj, form, change):
           obj.created_by = request.user
           super().save_model(request, obj, form, change)

admin.site.register(MuonTraSach, PostAdmin)