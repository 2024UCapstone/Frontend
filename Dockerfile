# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build app
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Install certbot
RUN apk add --no-cache certbot certbot-nginx

# Create required directories
RUN mkdir -p /etc/nginx/ssl/live/devse.gonetis.com

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create entrypoint script directly in Dockerfile
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start nginx with HTTP only configuration' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;" &' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Wait for nginx to start' >> /docker-entrypoint.sh && \
    echo 'sleep 5' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Try to get SSL certificate' >> /docker-entrypoint.sh && \
    echo 'if certbot --nginx -d devse.kr --non-interactive --agree-tos -m pyoneng_@naver.com; then' >> /docker-entrypoint.sh && \
    echo '    # SSL configuration' >> /docker-entrypoint.sh && \
    echo '    cat > /etc/nginx/conf.d/ssl.conf << EOF' >> /docker-entrypoint.sh && \
    echo '    server {' >> /docker-entrypoint.sh && \
    echo '        listen 443 ssl;' >> /docker-entrypoint.sh && \
    echo '        listen [::]:443 ssl;' >> /docker-entrypoint.sh && \
    echo '        http2 on;' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '        server_name devse.kr;' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '        ssl_certificate /etc/nginx/ssl/live/devse.kr/fullchain.pem;' >> /docker-entrypoint.sh && \
    echo '        ssl_certificate_key /etc/nginx/ssl/live/devse.kr/privkey.pem;' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    # 기본 리다이렉트 설정
    echo '        # 기본 리다이렉트' >> /docker-entrypoint.sh && \
    echo '        location = / {' >> /docker-entrypoint.sh && \
    echo '            return 301 /bbbWeb/;' >> /docker-entrypoint.sh && \
    echo '        }' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    # 현재 프로젝트를 /bbbWeb 경로에 제공
    echo '        # 현재 프로젝트' >> /docker-entrypoint.sh && \
    echo '        location /bbbWeb/ {' >> /docker-entrypoint.sh && \
    echo '            alias /usr/share/nginx/html/;' >> /docker-entrypoint.sh && \
    echo '            try_files \$uri \$uri/ /bbbWeb/index.html;' >> /docker-entrypoint.sh && \
    echo '            index index.html index.htm;' >> /docker-entrypoint.sh && \
    echo '        }' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    # 위키 서버를 /wiki 경로로 프록시
    echo '        # 위키 서버 프록시' >> /docker-entrypoint.sh && \
    echo '        location /wiki/ {' >> /docker-entrypoint.sh && \
    echo '            proxy_pass http://wiki-server:3000/;' >> /docker-entrypoint.sh && \
    echo '            proxy_http_version 1.1;' >> /docker-entrypoint.sh && \
    echo '            proxy_set_header Upgrade \$http_upgrade;' >> /docker-entrypoint.sh && \
    echo '            proxy_set_header Connection "upgrade";' >> /docker-entrypoint.sh && \
    echo '            proxy_set_header Host \$host;' >> /docker-entrypoint.sh && \
    echo '            proxy_set_header X-Real-IP \$remote_addr;' >> /docker-entrypoint.sh && \
    echo '            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;' >> /docker-entrypoint.sh && \
    echo '            proxy_set_header X-Forwarded-Proto \$scheme;' >> /docker-entrypoint.sh && \
    echo '            proxy_cache_bypass \$http_upgrade;' >> /docker-entrypoint.sh && \
    echo '        }' >> /docker-entrypoint.sh && \
    echo '    }' >> /docker-entrypoint.sh && \
    echo 'EOF' >> /docker-entrypoint.sh && \
    echo '    # Reload nginx to apply SSL configuration' >> /docker-entrypoint.sh && \
    echo '    nginx -s reload' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 880 4433

ENTRYPOINT ["/docker-entrypoint.sh"]