import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";
import axios from "axios";

export default function Navbar() {
  const user = useSelector(s => s.user);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const signOut = async () => {
    await api.post("/auth/logout/", {}, { withCredentials: true });
    dispatch(logout());
    nav("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      {user ? (
        <>
          <Link to="/">Мои файлы</Link>
          {user.is_admin && <Link to="/admin">Админка</Link>}
          <button onClick={signOut}>Выйти</button>
        </>
      ) : (
        <>
          <Link to="/login">Вход</Link>
          <Link to="/register">Регистрация</Link>
        </>
      )}
    </nav>
  );
}
