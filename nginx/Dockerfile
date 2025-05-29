# nginx/Dockerfile

# 1) Build frontend vào dist
FROM node:18-alpine AS front-builder
WORKDIR /app

# Copy và cài dependencies của front-end
COPY front-end/package*.json ./
RUN npm install

# Copy toàn bộ code front-end
COPY front-end/ ./

# Nhận ARG từ Compose để inject vào build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build Vite → tạo /app/dist
RUN npm run build

# 2) Serve bằng Nginx
FROM nginx:alpine

# Copy folder dist từ stage trước
COPY --from=front-builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx từ folder nginx/
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Chạy Nginx ở foreground
CMD ["nginx", "-g", "daemon off;"]
