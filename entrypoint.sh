#!/bin/sh
set -e

echo "Running migrations..."
chown -R www-data:www-data /var/www/storage /var/www/database
chmod -R 775 /var/www/database /var/www/storage
php artisan migrate --force

# 1. Kiểm tra file .env, nếu chưa có thì tạo từ .env.example
if [ ! -f .env ]; then
    cp .env.example .env
fi

# 2. Kiểm tra nếu APP_KEY trống hoặc chưa có, thì generate key mới
if grep -q "APP_KEY=$" .env || ! grep -q "APP_KEY=" .env; then
    echo "APP_KEY is missing or empty. Generating new key..."
    php artisan key:generate
fi

# 3. Chạy lệnh gốc của container (ví dụ: php-fpm hoặc nginx)
exec "$@"