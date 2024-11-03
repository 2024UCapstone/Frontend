# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# 먼저 env 파일 복사
COPY .env* ./

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .

# 빌드 시 환경변수 사용
RUN npm run build

# Production stage
FROM nginx:alpine

# nginx 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

# 80 포트만 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]