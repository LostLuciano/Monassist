#!/bin/sh
set -e

# Clear caches to avoid any configuration mismatch
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations automatically in production
echo "Running database migrations..."
php artisan migrate --force

# Execute the main container process (Apache)
echo "Starting Apache web server..."
exec apache2-foreground
