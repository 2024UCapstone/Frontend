# 빌드 스테이지
FROM node:18 as build

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# Build app
COPY . .
RUN npm run build

# 배포 스테이지
FROM nginx:alpine

# nginx 설정 파일 복사 (사용자 정의 설정이 필요한 경우)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 웹 파일 복사 (수정된 경로)
COPY --from=build /app/build /usr/share/nginx/html

# 80 포트 노출 (내부 포트)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
