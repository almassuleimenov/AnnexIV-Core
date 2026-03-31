# /3_frontend_dashboard/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json и ставим пакеты
COPY package*.json ./
RUN npm install

# Копируем исходники фронтенда
COPY . .

# Открываем порт Next.js
EXPOSE 3000

# Запускаем в режиме разработчика
CMD ["npm", "run", "dev"]