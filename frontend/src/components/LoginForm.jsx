import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store";

export default function LoginForm() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post("/auth/login/", form, { withCredentials: true });
      // После логина получаем текущего юзера (/api/auth/me/) — реализуешь на бэке
      const { data } = await axios.get("/api/auth/me/", { withCredentials: true });
      dispatch(setUser(data));
      nav("/");
    } catch {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: ".5rem", maxWidth: "320px", margin: "2rem auto" }}>
      <input name="username" placeholder="Логин" value={form.username} onChange={change} required />
      <input type="password" name="password" placeholder="Пароль" value={form.password} onChange={change} required />
      <button>Войти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
// Этот компонент — форма входа в систему.
// Он использует axios для отправки POST-запроса на сервер с логином и паролем.
// При успешном входе он получает данные текущего пользователя и сохраняет их в Redux-хранилище.
// Если вход не удался, отображается сообщение об ошибке.       