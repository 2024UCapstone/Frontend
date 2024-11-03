# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 복사
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# nginx 설정 수정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80 12555

CMD ["nginx", "-g", "daemon off;"]