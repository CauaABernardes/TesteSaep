import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./transacao.css";

export default function Transacao() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [transacoes, setTransacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtro, setFiltro] = useState({
    tipo_transacao: "",
    id_produto: "",
    data_inicio: "",
    data_fim: ""
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

  const fetchTransacoes = async () => {
    setLoading(true);

    try {
      let url = "http://127.0.0.1:8000/api/transacao/?";

      if (filtro.tipo_transacao)
        url += `tipo_transacao=${filtro.tipo_transacao}&`;

      if (filtro.id_produto)
        url += `id_produto=${filtro.id_produto}&`;

      if (filtro.data_inicio)
        url += `data_inicio=${filtro.data_inicio}T00:00:00&`;

      if (filtro.data_fim)
        url += `data_fim=${filtro.data_fim}T23:59:59&`;

      console.log("URL:", url); // debug

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransacoes(res.data);
    } catch (err) {
      console.log(err.response?.data);
      alert("Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
    fetchTransacoes(); // carrega tudo ao abrir
  }, []);

  const handleFiltro = (e) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value,
    });
  };

  const limparFiltro = () => {
    setFiltro({
      tipo_transacao: "",
      id_produto: "",
      data_inicio: "",
      data_fim: ""
    });

    fetchTransacoes();
  };

  return (
    <div className="layout">

      <aside className="sidebar">
        <h2>Sistema</h2>

        <button onClick={() => navigate("/home")}>Produtos</button>
        <button onClick={() => navigate("/produtos/novo")}>
          + Novo Produto
        </button>
        <button onClick={() => navigate("/produtos/transacao")}>
          Histórico de Transações
        </button>
        <button onClick={() => navigate("/produtos/nova-transacao")}>
          Nova Transação
        </button>

        <button className="logout" onClick={() => navigate("/login")}>
          🚪 Sair
        </button>
      </aside>

      <main className="content">

        <div className="topbar">
          <h1>Transações</h1>
        </div>

        {/* FILTROS */}
        <div className="card filtroCard">
          <div className="formGrid">

            <div className="field">
              <label>Tipo</label>
              <select name="tipo_transacao" value={filtro.tipo_transacao} onChange={handleFiltro}>
                <option value="">Todos</option>
                <option value="ENTRADA">Entrada</option>
                <option value="RETIRADA">Retirada</option>
              </select>
            </div>

            <div className="field">
              <label>Produto</label>
              <select name="id_produto" value={filtro.id_produto} onChange={handleFiltro}>
                <option value="">Todos</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Data início</label>
              <input
                type="date"
                name="data_inicio"
                value={filtro.data_inicio}
                onChange={handleFiltro}
              />
            </div>

            <div className="field">
              <label>Data fim</label>
              <input
                type="date"
                name="data_fim"
                value={filtro.data_fim}
                onChange={handleFiltro}
              />
            </div>

          </div>

          {/* BOTÕES */}
          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <button className="btn" onClick={fetchTransacoes}>
              🔍 Filtrar
            </button>

            <button className="btn" onClick={limparFiltro}>
              ❌ Limpar
            </button>
          </div>
        </div>

        {/* TABELA */}
        <div className="card">
          {loading ? (
            <p className="center">Carregando...</p>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Usuário</th>
                    <th>Data</th>
                  </tr>
                </thead>

                <tbody>
                  {transacoes.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id_produto_nome}</td>

                      <td style={{
                        color: t.tipo_transacao === "ENTRADA"
                          ? "#22c55e"
                          : "#ef4444"
                      }}>
                        {t.tipo_transacao}
                      </td>

                      <td>
                        {t.tipo_transacao === "ENTRADA" ? "+" : "-"} {t.quantidade}
                      </td>

                      <td>{t.id_usuario_nome}</td>

                      <td>
                        {new Date(t.data_transacao).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {transacoes.length === 0 && (
                <p className="empty">Nenhuma transação encontrada</p>
              )}
            </>
          )}
        </div>

      </main>
    </div>
  );
}