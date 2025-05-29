# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy và cài dependencies
COPY package*.json ./
RUN npm install

# Copy code và build
COPY . .
# Inject biến build-time từ ARG
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build    # tạo thư mục dist/

