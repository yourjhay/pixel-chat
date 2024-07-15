# Use a slimmer base image focused on PHP
FROM php:8.3-fpm-alpine


ARG DEPENDENCY_PACKAGES_ALPINE='fcgi shadow npm'
ARG DEPENDENCY_PHP_EXTENSIONS='opcache pcntl pdo_mysql redis bcmath zip mysqli mongodb'

ENV APP_BASE_DIR=/app \
    COMPOSER_HOME=/composer \
    PHP_DATE_TIMEZONE="Asia/Manila" \
    PHP_FPM_ERROR_LOG=/var/www/html/logs/php-fpm.log \
    PHP_USER="sail" \
    TZ=UTC

RUN addgroup -g 1000 ${PHP_USER} \
    && adduser -G ${PHP_USER} -u 1000 ${PHP_USER} -D \
    && mkdir /app \
    && mkdir -p /var/www/html/logs 
    
# Avoid unnecessary package updates (uses apk for Alpine)
RUN apk update && apk add --no-cache $DEPENDENCY_PACKAGES_ALPINE

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN chown -R ${PHP_USER}:${PHP_USER} /app && \
    chmod -R 775 /app && \
    mkdir -p ${COMPOSER_HOME} && \
    chown -R ${PHP_USER}:${PHP_USER} ${COMPOSER_HOME}

# Ensure "php-fpm-healthcheck" is installed
RUN echo "⬇️ Downloading php-fpm-healthcheck..." && \
    curl -o /usr/local/bin/php-fpm-healthcheck https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/v0.5.0/php-fpm-healthcheck && \
    chmod +x /usr/local/bin/php-fpm-healthcheck && \
    \
    # Install default PHP extensions
    install-php-extensions "${DEPENDENCY_PHP_EXTENSIONS}"

# install composer from Composer's official Docker image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Enable php-fpm healthcheck status page
RUN set -xe && echo "pm.status_path = /status" >> /usr/local/etc/php-fpm.d/zz-docker.conf

EXPOSE 9000

# Installing bash
RUN apk add bash && \
    sed -i 's/bin\/ash/bin\/bash/g' /etc/passwd

  # Set working directory
WORKDIR /app


USER ${PHP_USER}


CMD ["php-fpm"]

HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
    CMD php-fpm-healthcheck || exit 1
