import { useState } from "react";
import { useNavigate } from "react-router-dom";


import { api } from "../api";     

const handleSubmit = async e => {
  e.preventDefault();
  await api.post("auth/signup/", { username, full_name, email, password });
};




// ------------ локальные правила валидации ------------
const rules = {
  username: v =>
    /^[A-Za-z][A-Za-z0-9]{3,19}$/.test(v) ||
    "Логин: латиница, 4‑20 символов, первая — буква",
  full_name: v =>
    v.trim().length > 0 || "Имя не может быть пустым",
  email: v =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Некорректный email",
  password: v =>
    v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v) ||
    "Пароль ≥ 8 симв., буквы и цифры",
};

// Helper: прогоняем все правила и выдаём объект {field: "ошибка", …}
const validateAll = form =>
  Object.entries(form).reduce((acc, [k, v]) => {
    const res = rules[k](v);
    if (res !== true) acc[k] = res;
    return acc;
  }, {});

// ------------ основной компонент ------------
export default function RegisterForm() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();

    // 1) клиентская валидация
    const clientErr = validateAll(form);
    if (Object.keys(clientErr).length) {
      setErrors(clientErr);
      return;
    }

    try {
      // 2) запрос на API
      await api.post("/auth/signup/", form);
      nav("/login");                        // успех → переход на /login
    } catch (e) {
      // 3) сервер вернул объект ошибок вида {field: ["msg"]}
      const err = e.response?.data || {};
      const mapped = Object.fromEntries(
        Object.entries(err).map(([k, v]) => [k, v[0]])
      );
      setErrors(mapped);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "grid",
        gap: ".5rem",
        maxWidth: "320px",
        margin: "2rem auto",
      }}
    >
      {/* Поля формы — генерируем по списку */}
      {["username", "full_name", "email", "password"].map(name => (
        <div key={name} style={{ display: "grid" }}>
          <input
            type={name === "password" ? "password" : "text"}
            name={name}
            placeholder={name}
            value={form[name]}
            onChange={change}
            style={{ padding: "4px" }}
          />
          {errors[name] && (
            <small style={{ color: "red" }}>{errors[name]}</small>
          )}
        </div>
      ))}

      <button disabled={Object.keys(errors).length > 0}>
        Регистрация
      </button>

      {/* Общая ошибка, если поле неизвестно */}
      {errors.non_field && (
        <p style={{ color: "red" }}>{errors.non_field}</p>
      )}
    </form>
  );
}
