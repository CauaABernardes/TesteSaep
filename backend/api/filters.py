import django_filters
from .models import *

class UsuarioFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='nome',lookup_expr='icontains')
       
    class Meta:
        model = Usuario
        fields = ['nome']

class ProdutoFilter(django_filters.FilterSet):
    tipo = django_filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = Produto
        fields = ['tipo']

class TransacaoFilter(django_filters.FilterSet):

    tipo_transacao = django_filters.CharFilter(lookup_expr='exact')
    id_produto = django_filters.NumberFilter(field_name='id_produto')

    data_inicio = django_filters.DateTimeFilter(
        field_name='data_transacao',
        lookup_expr='gte'
    )

    data_fim = django_filters.DateTimeFilter(
        field_name='data_transacao',
        lookup_expr='lte'
    )

    class Meta:
        model = Transacao
        fields = ['tipo_transacao', 'id_produto']