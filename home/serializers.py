from rest_framework import serializers 
from home.models import DocGia, Sach, TaiKhoan, MuonTraSach 
 
class DocGiaSerializers(serializers.ModelSerializer):
 
    class Meta:
        model = DocGia
        fields =  '__all__'

class MuonTraSachSerializers(serializers.ModelSerializer):

    class Meta:
        model = MuonTraSach
        fields =  '__all__'
