# Install pnpm packages
FROM node:25-alpine AS deps

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build frontend & backend
FROM php:8.3-fpm

COPY --from=node:25-trixie /usr/local/bin/ /usr/local/bin/
COPY --from=node:25-trixie /usr/local/lib/node_modules/ /usr/local/lib/node_modules/
COPY --from=node:25-trixie /usr/local/include/ /usr/local/include/
COPY --from=node:25-trixie /usr/local/share/ /usr/local/share/

## Install dependencies
RUN apt-get update --fix-missing && apt-get install --no-install-recommends --no-install-suggests -y \        
        nginx \
#     libpng-dev \
#     libjpeg-dev \
#     libfreetype6-dev \
        zlib1g-dev \
        pkg-config \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libzip-dev \
        libxml2-dev \
        zip \
        unzip \
#     git \
#     curl \
#     && docker-php-ext-configure gd --with-freetype --with-jpeg \
#     && docker-php-ext-install pdo_mysql gd bcmath zip
        supervisor

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .
COPY nginx.conf /etc/nginx/sites-available/default
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENV NEXT_TELEMETRY_DISABLED 1

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd \
    pdo_mysql \
    bcmath \
    zip \
    dom \
    fileinfo
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist
RUN php artisan ziggy:generate

RUN npm run build

RUN composer install --optimize-autoloader --no-dev

RUN chown -R www-data:www-data /var/www/storage \
        /var/www/bootstrap/cache /var/www/database
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache \
        /var/www/database

EXPOSE 80

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]