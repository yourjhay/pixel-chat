FROM php:8.2-fpm

ARG WWWGROUP
ENV TZ=UTC \
 PHP_FPM_ERROR_LOG=/var/www/html/logs/php-fpm.log \
  PHP_USER="sail"
ARG NODE_VERSION=20
ARG POSTGRES_VERSION=15
ARG MYSQL_CLIENT="default-mysql-client"
WORKDIR /app


# Surpresses debconf complaints of trying to install apt packages interactively
# https://github.com/moby/moby/issues/4032#issuecomment-192327844
ARG DEBIAN_FRONTEND=noninteractive
ARG DEPENDENCY_PACKAGES_ALPINE='libfcgi-bin zip npm supervisor'
ARG DEPENDENCY_PHP_EXTENSIONS='opcache pcntl pdo_mysql redis bcmath zip mysqli exif gd'

# Update package lists
# Create directory for GPG keys
RUN apt-get update --fix-missing && \
    apt-get upgrade -y && \
    apt-get --no-install-recommends install -y apt-utils && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /etc/apt/keyrings

RUN apt-get update -y && \ 
    apt-get -y --no-install-recommends install $DEPENDENCY_PACKAGES_ALPINE

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/


    # Ensure "php-fpm-healthcheck" is installed
RUN echo "⬇️ Downloading php-fpm-healthcheck..." && \
    curl -o /usr/local/bin/php-fpm-healthcheck https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/v0.5.0/php-fpm-healthcheck && \
    chmod +x /usr/local/bin/php-fpm-healthcheck && \
    \
    # Install default PHP extensions
    install-php-extensions "${DEPENDENCY_PHP_EXTENSIONS}"

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
# Enable php-fpm healthcheck status page
RUN set -xe && echo "pm.status_path = /status" >> /usr/local/etc/php-fpm.d/zz-docker.conf


# Update package lists (again)
RUN apt-get update && \
    # Install npm package managers
    npm install -g bun


RUN groupadd --force -g $WWWGROUP sail && \
    useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail && \
    chown -R ${PHP_USER}:${PHP_USER} /var/www/html && \
    chmod -R 775 /app && \
    mkdir -p ${COMPOSER_HOME} && \
    chown -R ${PHP_USER}:${PHP_USER} ${COMPOSER_HOME}

EXPOSE 9000
RUN mkdir -p /var/www/html/logs


# Clean up temporary files
RUN apt-get -y autoremove
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Start the PHP-FPM server
CMD ["php-fpm"]

HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
    CMD php-fpm-healthcheck || exit 1