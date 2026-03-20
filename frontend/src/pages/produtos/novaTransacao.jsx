import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./novaTransacao.css";

export default function NovaTransacao() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id_produto: "",
    tipo_transacao: "ENTRADA",
    quantidade: "",
  });

  const fetchProdutos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/produtos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(res.data);
    } catch {
      alert("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/transacao/",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Transação criada com sucesso!");
      navigate("/produtos/transacao");
    } catch (err) {
      if (err.response?.data) {
        alert(JSON.stringify(err.response.data));
      } else {
        alert("Erro ao criar transação");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">

      <aside className="sidebar">
        <h2>Sistema</h2>

        <button onClick={() => navigate("/home")}>Produtos</button>
        <button onClick={() => navigate("/produtos/novo")}>
          + Novo Produto
        </button>
        <button onClick={() => navigate("/produtos/transacao")}>Histórico de Transações</button>
        <button onClick={() => navigate("/produtos/nova-transacao")}>Nova Transação</button>

        <button className="logout" onClick={() => navigate("/login")}>
          🚪 Sair
        </button>
      </aside>

      <main className="content">
        <div className="topbar">
          <h1>Nova Transação</h1>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="formGrid">

            <div className="field">
              <label>Produto</label>
              <select
                name="id_produto"
                value={form.id_produto}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Tipo</label>
              <select
                name="tipo_transacao"
                value={form.tipo_transacao}
                onChange={handleChange}
              >
                <option value="ENTRADA">Entrada</option>
                <option value="RETIRADA">Retirada</option>
              </select>
            </div>

            <div className="field">
              <label>Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={form.quantidade}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}