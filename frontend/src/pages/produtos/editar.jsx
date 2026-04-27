import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./editar.css";

export default function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    tensao: "",
    dimensoes: "",
    resolucao_tela: "",
    armazenamento: "",
    conectividade: "",
    descricao: "",
    estoque_atual: "",
    estoque_minimo: "",
    preco_unitario: ""
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/produtos/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setForm(res.data);
      } catch {
        alert("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const salvar = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/produtos/${id}/`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Produto atualizado!");
      navigate("/home");
    } catch {
      alert("Erro ao salvar");
    }
  };

  if (loading) return <p className="center">Carregando...</p>;

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Sistema</h2>

        <button onClick={() => navigate("/home")}>Produtos</button>
        <button onClick={() => navigate("/produtos/")}>
          + Novo Produto
        </button>
        <button onClick={() => navigate("/produtos/transacao")}>Histórico de Transações</button>
        <button onClick={() => navigate("/produtos/nova-transacao")}>Nova Transação</button>

        <button className="logout" onClick={() => navigate("/login")}>
          🚪 Sair
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main className="content">
        <div className="topbar">
          <h1>Editar Produto</h1>
        </div>

        <div className="card">
          <form className="formGrid" onSubmit={salvar}>

            {/* BASICO */}
            <div className="field full">
              <label>Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="SMARTPHONE">Smartphone</option>
                <option value="NOTEBOOK">Notebook</option>
                <option value="SMART TV">Smart TV</option>
              </select>
            </div>

            <div className="field">
              <label>Tensão</label>
              <input name="tensao" value={form.tensao} onChange={handleChange} />
            </div>

            {/* ESPECIFICAÇÕES */}
            <div className="field">
              <label>Dimensões</label>
              <input name="dimensoes" value={form.dimensoes} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Resolução</label>
              <input name="resolucao_tela" value={form.resolucao_tela} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Armazenamento</label>
              <input name="armazenamento" value={form.armazenamento} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Conectividade</label>
              <input name="conectividade" value={form.conectividade} onChange={handleChange} />
            </div>

            {/* DESCRIÇÃO */}
            <div className="field full">
              <label>Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} />
            </div>

            {/* ESTOQUE / PREÇO */}
            <div className="field">
              <label>Estoque Atual</label>
              <input type="number" name="estoque_atual" value={form.estoque_atual} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Estoque Mínimo</label>
              <input type="number" name="estoque_minimo" value={form.estoque_minimo} onChange={handleChange} />
            </div>

            <div className="field full">
              <label>Preço</label>
              <input type="number" step="0.01" name="preco_unitario" value={form.preco_unitario} onChange={handleChange} />
            </div>

            {/* BOTÕES */}
            <div className="actions full">
              <button type="submit" className="btnSalvar">💾 Salvar</button>
              <button type="button" className="btnVoltar" onClick={() => navigate("/home")}>
                Voltar
              </button>
            </div>

          </form>
                  </div>
      </main>
    </div>
  );
}