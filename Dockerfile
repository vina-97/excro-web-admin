# Stage 1: Build the Vite app
FROM node:24-slim AS build

WORKDIR /app

# Clean and install
COPY package*.json ./
#RUN rm -rf node_modules package-lock.json && npm install
#RUN npm install
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
