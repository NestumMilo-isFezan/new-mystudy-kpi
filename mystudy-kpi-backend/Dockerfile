# Stage 1: Base image with system dependencies
FROM serversideup/php:8.4-frankenphp AS base

USER root
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev \
    && docker-php-ext-install pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
USER www-data

# Stage 2: Install dependencies
FROM base AS builder
WORKDIR /var/www/html
# Copy minimal files needed for composer scripts to run
COPY --chown=www-data:www-data composer.json composer.lock ./
COPY --chown=www-data:www-data bin/ bin/
COPY --chown=www-data:www-data config/ config/
COPY --chown=www-data:www-data src/ src/
COPY --chown=www-data:www-data .env* ./
RUN composer install --no-dev --no-interaction --no-progress --optimize-autoloader

# Stage 3: Production image
FROM base
WORKDIR /var/www/html
COPY --chown=www-data:www-data . .
COPY --chown=www-data:www-data --from=builder /var/www/html/vendor ./vendor
