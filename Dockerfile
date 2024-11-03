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
    echo 'if certbot --nginx -d devse.gonetis.com --non-interactive --agree-tos -m pyoneng_@naver.com; then' >> /docker-entrypoint.sh && \
    echo '    # SSL configuration' >> /docker-entrypoint.sh && \
    echo '    cat > /etc/nginx/conf.d/ssl.conf << EOF' >> /docker-entrypoint.sh && \
    echo '    server {' >> /docker-entrypoint.sh && \
    echo '        listen 443 ssl;' >> /docker-entrypoint.sh && \
    echo '        listen [::]:443 ssl;' >> /docker-entrypoint.sh && \
    echo '        http2 on;' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '        server_name devse.gonetis.com;' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '        ssl_certificate /etc/nginx/ssl/live/devse.gonetis.com/fullchain.pem;' >> /docker-entrypoint.sh && \
    echo '        ssl_certificate_key /etc/nginx/ssl/live/devse.gonetis.com/privkey.pem;' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '        root /usr/share/nginx/html;' >> /docker-entrypoint.sh && \
    echo '        index index.html index.htm;' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '        location / {' >> /docker-entrypoint.sh && \
    echo '            try_files \$uri \$uri/ /index.html;' >> /docker-entrypoint.sh && \
    echo '        }' >> /docker-entrypoint.sh && \
    echo '    }' >> /docker-entrypoint.sh && \
    echo 'EOF' >> /docker-entrypoint.sh && \
    echo '    # Reload nginx to apply SSL configuration' >> /docker-entrypoint.sh && \
    echo '    nginx -s reload' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start cron for certificate renewal' >> /docker-entrypoint.sh && \
    echo 'crond' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Keep the container running' >> /docker-entrypoint.sh && \
    echo 'wait' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]