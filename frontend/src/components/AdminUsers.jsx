import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const { data } = await axios.get("/api/users/", { withCredentials: true });
    setUsers(data);
  };

  useEffect(() => { load(); }, []);

  const delUser = id => async () => {
    await axios.delete(`/api/users/${id}/`, { withCredentials: true });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <section style={{ padding: "1rem" }}>
      <h2>Администрирование пользователей</h2>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Логин</th>
            <th>Email</th>
            <th>Admin?</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_admin ? "✓" : ""}</td>
              <td><button onClick={delUser(u.id)}>Удалить</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
// Этот компонент — админка для управления пользователями.
// Он загружает список пользователей с сервера и отображает их в виде таблицы.
// Администратор может удалить любого пользователя.
// При удалении пользователя отправляется DELETE-запрос на сервер,
// и пользователь удаляется из списка.
