FROM ubuntu:latest
LABEL authors="nicorioso"

ENTRYPOINT ["top", "-b"]

# Etapa 1: build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: servir con nginx
FROM nginx:1.27
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]