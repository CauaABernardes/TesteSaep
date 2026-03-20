import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./registrar.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    nome: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };


  const validar = () => {
    if (!form.username || !form.nome || !form.password || !form.password2) {
      return "Preencha os campos obrigatórios.";
    }
    if (form.password.length < 3) {
      return "A senha deve ter pelo menos 3 caracteres.";
    }
    if (form.password !== form.password2) {
      return "As senhas não conferem.";
    }
    return "";
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const erro = validar();
    if (erro) {
      setMsg({ type: "error", text: erro });
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: form.username,
        email: form.email,      
        nome: form.nome,
        password: form.password,
        password2: form.password2,
      });

      setMsg({ type: "success", text: "Cadastro realizado com sucesso! Você já pode entrar." });
      setTimeout(() => navigate("/login"), 700);
    } catch (error) {
      console.log("Erro no cadastro:", error);

      const data = error?.response?.data;
      if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : String(data[firstKey]);
        setMsg({ type: "error", text: firstMsg });
      } else {
        setMsg({ type: "error", text: "Não foi possível cadastrar. Verifique os dados." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="registerCard">
        <div className="registerHeader">
          <h1 className="registerTitle">Criar conta</h1>
          <p className="registerSubtitle">Preencha seus dados para começar</p>
        </div>

        <form className="registerForm" onSubmit={cadastrar}>
          <div className="grid2">
            <div className="field">
              <label className="label">Usuário *</label>
              <input
                className="input"
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                placeholder="ex: usuario123"
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label className="label">E-mail</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="email@dominio.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid2">
            <div className="field">
              <label className="label">Nome *</label>
              <input
                className="input"
                value={form.nome}
                onChange={(e) => setField("nome", e.target.value)}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
            </div>

          </div>

          <div className="grid2">
            <div className="field">
              <label className="label">Senha *</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div className="field">
              <label className="label">Confirmar senha *</label>
              <input
                className="input"
                type="password"
                value={form.password2}
                onChange={(e) => setField("password2", e.target.value)}
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
            </div>
          </div>

          {msg.text && (
            <div className={msg.type === "success" ? "alert alert--success" : "alert"}>
              {msg.text}
            </div>
          )}

          <button className="btnPrimary" type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <div className="divider">
            <span>ou</span>
          </div>

          <p className="footerText">
            Já tem conta?{" "}
            <Link className="link" to="/login">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}