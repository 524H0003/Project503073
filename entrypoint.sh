#!/bin/sh
set -e

# 1. Kiểm tra file .env, nếu chưa có thì tạo từ .env.example
if [ ! -f .env ]; then
    echo ".env file not found. Creating from .env.example..."
    cp .env.example .env
fi

# 3. TỰ ĐỘNG TẠO CÁC BIẾN REVERB (Nếu chưa có hoặc đang trống)
echo "Checking Reverb configurations..."

# Tạo REVERB_APP_ID (Thường là một chuỗi số gồm 6 chữ số ngẫu nhiên)
if grep -q "REVERB_APP_ID=$" .env || ! grep -q "REVERB_APP_ID=" .env; then
    RANDOM_ID=$(export LC_ALL=C; tr -dc '0-9' < /dev/urandom | head -c 6)
    # Nếu dòng cấu hình đã có nhưng trống, thay thế nó. Nếu chưa có, append vào cuối file.
    if grep -q "REVERB_APP_ID=" .env; then
        sed -i "s/^REVERB_APP_ID=.*/REVERB_APP_ID=$RANDOM_ID/" .env
    else
        echo "REVERB_APP_ID=$RANDOM_ID" >> .env
    fi
    echo "Generated new REVERB_APP_ID."
fi

# Tạo REVERB_APP_KEY (Chuỗi chữ và số gồm 8-16 ký tự viết thường)
if grep -q "REVERB_APP_KEY=$" .env || ! grep -q "REVERB_APP_KEY=" .env; then
    RANDOM_KEY=$(export LC_ALL=C; tr -dc 'a-z0-9' < /dev/urandom | head -c 12)
    if grep -q "REVERB_APP_KEY=" .env; then
        sed -i "s/^REVERB_APP_KEY=.*/REVERB_APP_KEY=$RANDOM_KEY/" .env
    else
        echo "REVERB_APP_KEY=$RANDOM_KEY" >> .env
    fi
    echo "Generated new REVERB_APP_KEY."
fi

# Tạo REVERB_APP_SECRET (Chuỗi chữ và số bảo mật dài hơn, khoảng 24 ký tự)
if grep -q "REVERB_APP_SECRET=$" .env || ! grep -q "REVERB_APP_SECRET=" .env; then
    RANDOM_SECRET=$(export LC_ALL=C; tr -dc 'a-z0-9' < /dev/urandom | head -c 24)
    if grep -q "REVERB_APP_SECRET=" .env; then
        sed -i "s/^REVERB_APP_SECRET=.*/REVERB_APP_SECRET=$RANDOM_SECRET/" .env
    else
        echo "REVERB_APP_SECRET=$RANDOM_SECRET" >> .env
    fi
    echo "Generated new REVERB_APP_SECRET."
fi

# 2. Kiểm tra nếu APP_KEY trống hoặc chưa có, thì generate key mới
if grep -q "APP_KEY=$" .env || ! grep -q "APP_KEY=" .env; then
    echo "APP_KEY is missing or empty. Generating new key..."
    php artisan key:generate
fi


echo "Clearing Laravel config cache..."
php artisan config:clear

php artisan storage:link

# 4. Chạy migrations và phân quyền (Sau khi toàn bộ môi trường cấu hình đã sẵn sàng)
echo "Running database migrations..."
DB_FILE="/var/www/database/database.sqlite"

if [ ! -f "$DB_FILE" ]; then
    echo "Không tìm thấy file Database. Đang tạo file mới tại $DB_FILE..."
    touch "$DB_FILE"
    # Đảm bảo phân quyền cho ứng dụng ghi được vào file này
    chown www-data:www-data "$DB_FILE"
    chmod 775 "$DB_FILE"

    echo "Chạy migrations..."
    php artisan migrate --force
fi

echo "Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/database
chmod -R 775 /var/www/database /var/www/storage

# 5. Chạy lệnh gốc của container (ví dụ: php-fpm hoặc nginx)
exec "$@"