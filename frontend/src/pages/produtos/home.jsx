import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProdutos = async () => {
    try {
      const url = tipoFiltro
        ? `http://127.0.0.1:8000/api/produtos/?tipo=${tipoFiltro}`
        : `http://127.0.0.1:8000/api/produtos/`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProdutos(response.data);
    } catch {
      setErro("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [tipoFiltro]);

  const deletarProduto = async (id) => {
    if (!window.confirm("Deseja excluir este produto?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/produtos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProdutos(produtos.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao excluir");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className="center">Carregando...</p>;
  if (erro) return <p className="center">{erro}</p>;

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Sistema</h2>

        <button onClick={() => navigate("/home")}>Produtos</button>
        <button onClick={() => navigate("/produtos/novo")}>
          + Novo Produto
        </button>
        <button onClick={() => navigate("/produtos/transacao")}>Histótico de Transações</button>
        <button onClick={() => navigate("/produtos/nova-transacao")}>Nova Transação</button>

        <button className="logout" onClick={logout}>
          🚪 Sair
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main className="content">
        <div className="container">
          {/* HEADER */}
          <div className="topbar">
            <h1>Produtos</h1>

            {produtos.some(p => p.estoque_atual <= p.estoque_minimo) && (
              <div className="alertaEstoque">
                ⚠️ Atenção! Produtos com estoque baixo:

                <ul>
                  {produtos
                    .filter(p => p.estoque_atual <= p.estoque_minimo)
                    .map(p => (
                      <li key={p.id}>
                        {p.nome} ({p.estoque_atual} em estoque)
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="filtro">
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="selectEdit"
              >
                <option value="">Todos</option>
                <option value="SMARTPHONE">Smartphone</option>
                <option value="NOTEBOOK">Notebook</option>
                <option value="SMART TV">Smart TV</option>
              </select>
            </div>
          </div>

          {/* CARD TABELA */}
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Mínimo</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {produtos.map((produto) => {
                  const estoqueBaixo =
                    produto.estoque_atual <= produto.estoque_minimo;

                  return (
                    <tr key={produto.id}>
                      <td>{produto.nome}</td>

                      <td>
                        R$ {Number(produto.preco_unitario).toFixed(2)}
                      </td>

                      <td className={estoqueBaixo ? "estoqueBaixo" : ""}>
                        {produto.estoque_atual}
                      </td>

                      <td>{produto.estoque_minimo}</td>

                      <td>
                        <div className="actions">
                          <button
                            className="btnEditar"
                            onClick={() =>
                              navigate(`/produtos/editar/${produto.id}`)
                            }
                          >
                            ✏️
                          </button>

                          <button
                            className="btnExcluir"
                            onClick={() => deletarProduto(produto.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {produtos.length === 0 && (
              <p className="empty">Nenhum produto encontrado</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}