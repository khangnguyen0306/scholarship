# --- Build Stage ---
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    COPY . .
    ARG VITE_API_URL
    ENV VITE_API_URL=$VITE_API_URL
    RUN npm run build
    
    # --- Serve Stage ---
    FROM nginx:alpine
    COPY --from=builder /app/dist /usr/share/nginx/html
    COPY nginx.conf /etc/nginx/conf.d/default.conf  # Copy file cấu hình nginx
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    