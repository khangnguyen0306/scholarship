# front-end/Dockerfile

# Step 1: build react app
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: serve static files bằng nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Nếu bạn dùng Vite thì build output nằm trong /dist (mặc định vite)
# Cấu hình default của nginx đủ để serve static react app rồi.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
