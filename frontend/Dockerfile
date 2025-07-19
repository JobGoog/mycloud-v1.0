# ---------- билд‑стадия ----------
FROM node:21-alpine AS build
WORKDIR /app

COPY package.json vite.config.js ./
RUN npm install

COPY src ./src
RUN npm run build

# ---------- рантайм (опционально) ----------
# Бэкенд/WhiteNoise заберёт /dist и отдаст как статику,
# так что отдельный фронтовый контейнер на проде нам не нужен.
