from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from django.db import transaction

from django_filters.rest_framework import DjangoFilterBackend

from .models import Produto, Transacao, Usuario
from .serializers import *
from .filters import *

class ProdutoViewSet(ModelViewSet):

    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = ProdutoFilter

class RegisterView(APIView):
        def post(self, request):
            serializer = RegisterSerializer(data = request.data)
            serializer.is_valid(raise_exception = True)
            serializer.save()

            return Response({"Usuário criado com sucesso."}, status = status.HTTP_201_CREATED)

class MeView(RetrieveAPIView):
    serializer_class = UsuarioMeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        perfil, created = Usuario.objects.get_or_create(
            usuario=self.request.user,
            defaults={
                'nome': self.request.user.username,
                'email': self.request.user.email,
            }
        )
        return perfil

class UsuarioViewSet(ModelViewSet):

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]

    filterset_class = UsuarioFilter

    def get_queryset(self):        
        return Usuario.objects.filter(usuario=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'me':
            return UsuarioMeSerializer
        return super().get_serializer_class()
    
    def get_object(self):
        obj = super().get_object()
        
        if obj.usuario != self.request.user:
            raise PermissionDenied("Você não pode acessar esse usuário")
        
        return obj

    @action(
        detail=False,
        methods=['get'],
        url_path='me',
        permission_classes=[IsAuthenticated]
    )
    def me(self, request):
        usuario = Usuario.objects.filter(usuario=request.user).first()
        if not usuario:
            return Response({'detail': "Perfil de usuário não encontrado."}, status=404)
        
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)

class TransacaoViewSet(ModelViewSet):

    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TransacaoFilter

    def perform_create(self, serializer):
        with transaction.atomic():

            usuario = Usuario.objects.get(usuario=self.request.user)

            transacao = serializer.save(id_usuario=usuario)
            produto = transacao.id_produto

            if transacao.tipo_transacao == "ENTRADA":
                produto.estoque_atual += transacao.quantidade

            elif transacao.tipo_transacao == "RETIRADA":
                if produto.estoque_atual < transacao.quantidade:
                    raise ValidationError("Estoque insuficiente")

                produto.estoque_atual -= transacao.quantidade

            produto.save()

    def perform_update(self, serializer):
        with transaction.atomic():
            transacao_antiga = self.get_object()
            produto = transacao_antiga.id_produto

            # desfaz antiga
            if transacao_antiga.tipo_transacao == "ENTRADA":
                produto.estoque_atual -= transacao_antiga.quantidade
            else:
                produto.estoque_atual += transacao_antiga.quantidade

            nova_transacao = serializer.save()
            
            # aplica nova
            if nova_transacao.tipo_transacao == "ENTRADA":
                produto.estoque_atual += nova_transacao.quantidade
            else:
                if produto.estoque_atual < nova_transacao.quantidade:
                    raise ValidationError("Estoque insuficiente")

                produto.estoque_atual -= nova_transacao.quantidade

            produto.save()

    def perform_destroy(self, instance):
        with transaction.atomic():
            produto = instance.id_produto

            if instance.tipo_transacao == "ENTRADA":
                produto.estoque_atual -= instance.quantidade
            else:
                produto.estoque_atual += instance.quantidade

            produto.save()
            instance.delete()