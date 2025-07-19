import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function FileTable() {
  const user = useSelector(s => s.user);
  const [files, setFiles] = useState([]);

  const load = async () => {
    const { data } = await axios.get("/api/storage/files/", { withCredentials: true });
    setFiles(data);
  };

  useEffect(() => { load(); }, []);

  const upload = async e => {
    const fd = new FormData();
    fd.append("file", e.target.files[0]);
    await api.post("/storage/files/", fd, { withCredentials: true });
    load();
  };

  const del = id => async () => {
    await axios.delete(`/api/storage/files/${id}/`, { withCredentials: true });
    setFiles(files.filter(f => f.id !== id));
  };

  const genLink = id => async () => {
    const { data } = await api.post(`/api/storage/files/${id}/generate_link/`, {}, { withCredentials: true });
    await navigator.clipboard.writeText(`${location.origin}/api/storage/public/${data.link}/`);
    alert("Ссылка скопирована в буфер обмена");
  };

  return (
    <section style={{ padding: "1rem" }}>
      <h2>Файлы пользователя {user?.username}</h2>

      <input type="file" onChange={upload} />

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Размер</th>
            <th>Загружен</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {files.map(f => (
            <tr key={f.id}>
              <td>{f.original_name}</td>
              <td>{(f.size / 1024).toFixed(1)} KB</td>
              <td>{new Date(f.uploaded_at).toLocaleString()}</td>
              <td>
                <button onClick={del(f.id)}>🗑</button>
                <button onClick={genLink(f.id)}>🔗</button>
                <a href={`/api/storage/public/${f.public_link ?? ""}/`} download={f.original_name}>
                  ⬇️
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
// Этот компонент — таблица файлов пользователя.
// Он загружает файлы с сервера и отображает их в виде таблицы.
// Пользователь может загрузить новый файл, удалить существующий или сгенерировать ссылку для скачивания.
// При загрузке файла используется FormData для отправки файла на сервер.
// При удалении файла отправляется DELETE-запрос на сервер, а при генерации ссылки — POST-запрос.
// Ссылки на файлы можно скопировать в буфер обмена для дальнейшего
// использования. Ссылки на файлы также можно скачать напрямую.
