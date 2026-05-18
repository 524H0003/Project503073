# --- Stage 1: Build ---
FROM php:8.3-fpm AS build

# Cài Node.js từ image chính thức
COPY --from=node:25-trixie /usr/local/bin/ /usr/local/bin/
COPY --from=node:25-trixie /usr/local/lib/node_modules/ /usr/local/lib/node_modules/
COPY --from=node:25-trixie /usr/local/include/ /usr/local/include/
COPY --from=node:25-trixie /usr/local/share/ /usr/local/share/
ENV PATH="/usr/local/bin:${PATH}"

RUN apt-get update && apt-get install -y libzip-dev zip unzip git \
    && docker-php-ext-install zip 

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY . .

RUN npm install -g pnpm@10.9.0 \
    && pnpm install --frozen-lockfile \
    && composer install --no-dev --no-interaction --prefer-dist \
        --optimize-autoloader --no-scripts 
RUN npm run build


# --- Stage 2: Create image (Runtime) ---
FROM php:8.3-fpm-alpine

RUN apk add --no-cache nginx supervisor libzip-dev bash

RUN docker-php-ext-install zip pcntl bcmath

WORKDIR /var/www

COPY --from=build /app/vendor ./vendor
COPY --from=build /app/public/build ./public/build
COPY . .

COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chmod +x ./entrypoint.sh

EXPOSE 80 8080

ENTRYPOINT ["/var/www/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]