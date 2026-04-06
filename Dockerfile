FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL=/api
ARG VITE_RECAPTCHA_SITE_KEY=""
ARG VITE_SITE_URL=https://frontend-techcol.up.railway.app
ARG VITE_UPLOADS_PATH=/uploads/products
ARG VITE_DEBUG=false

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}
ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_UPLOADS_PATH=${VITE_UPLOADS_PATH}
ENV VITE_DEBUG=${VITE_DEBUG}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.railway.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
