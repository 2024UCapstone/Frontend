# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# 기존 설정 파일 제거
RUN rm /etc/nginx/conf.d/default.conf

# nginx.conf 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose ports
EXPOSE 80 3001

# Start nginx
CMD ["nginx", "-g", "daemon off;"]