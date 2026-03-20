from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    nome = serializers.CharField(required=False)

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        Usuario.objects.create(
            usuario=user,
            nome=validated_data.get("nome", user.username),
            email=validated_data["email"]
        )

        return user

class UsuarioMeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='usuario.username', read_only=True)
    email = serializers.CharField(source='usuario.email', read_only=True)
    
    is_active = serializers.BooleanField(source='usuario.is_active', read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'username', 'is_active']

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class TransacaoSerializer(serializers.ModelSerializer):

    id_produto_nome = serializers.CharField(
        source="id_produto.nome",
        read_only=True
    )
    
    id_usuario_nome = serializers.CharField(
        source="id_usuario.nome",
        read_only=True
    )

    class Meta:
        model = Transacao
        fields = '__all__'
        read_only_fields = ['id_usuario', 'data_transacao']

    def create(self, validated_data):
        request = self.context.get('request')
        usuario = Usuario.objects.get(usuario=request.user)

        validated_data['id_usuario'] = usuario

        return super().create(validated_data)

        