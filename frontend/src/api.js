// src/api.js – единый экземпляр
import axios from "axios";

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(r => r.startsWith(name + "="))
    ?.split("=")[1];
}

export const api = axios.create({
  baseURL: "/api/",
  withCredentials: true,            
});

api.interceptors.request.use(cfg => {
  const token = document.cookie
    .split("; ")
    .find(r => r.startsWith("csrftoken="))
    ?.split("=")[1];

  if (token) cfg.headers["X-CSRFToken"] = token;
  console.log("[API]", cfg.method.toUpperCase(), cfg.url, cfg.headers);
  return cfg;
});