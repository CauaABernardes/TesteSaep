from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User

# Create your models here.
class Produto(models.Model):

    TIPO_CHOICES = [
        ('SMARTPHONE', 'smartphone'),
        ('NOTEBOOK', 'notebooks'),
        ('SMART TV', 'smart tv')
    ]

    nome = models.CharField(max_length = 100)
    tipo = models.CharField(max_length = 15, choices = TIPO_CHOICES)
    tensao = models.CharField(max_length = 15)
    dimensoes = models.CharField(max_length = 15)
    resolucao_tela = models.CharField(max_length = 15)
    armazenamento = models.CharField(max_length = 15)
    conectividade = models.CharField(max_length = 100)
    descricao = models.TextField(null = False)
    estoque_minimo = models.IntegerField(null = False, validators = [MinValueValidator(1)])
    estoque_atual = models.IntegerField(null = False, validators = [MinValueValidator(0)])
    preco_unitario = models.DecimalField(max_digits = 10, decimal_places = 2, validators = [MinValueValidator(0.0)])

    def __str__(self):
        return self.nome

class Usuario(models.Model):

    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil")
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True, blank=True, null=True)

    def __str__(self):
        return self.nome

class Transacao(models.Model):

    TIPO_CHOICES = [
        ('ENTRADA', 'entrada'),
        ('RETIRADA', 'retirada')
    ]

    data_transacao = models.DateTimeField(auto_now_add=True)

    tipo_transacao = models.CharField(max_length=15, choices=TIPO_CHOICES)

    quantidade = models.IntegerField(
        validators=[MinValueValidator(1)]
    )

    id_produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name="transacoes"
    )

    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="transacoes"
    )

    def __str__(self):
        return f"{self.tipo_transacao} - {self.quantidade} ({self.data_transacao})"