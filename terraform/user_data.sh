#!/bin/bash
set -euo pipefail

# Comprehensive error trapping for diagnostic visibility
trap 'echo "[$(date -u)] ERROR: Bootstrap failed at line $LINENO (command: $BASH_COMMAND, exit code: $?)" | tee -a /var/log/bootstrap-error.log; echo "FAILED" > /var/log/bootstrap-status' ERR

# Log all output to /var/log/user-data.log
exec > >(tee -a /var/log/user-data.log) 2>&1
echo "=== Smart Water Monitor Bootstrap Started at $(date -u) ==="
echo "PENDING" > /var/log/bootstrap-status

# 1. Setup 2GB swap space (crucial for t3.micro with 1 GiB RAM to prevent OOM)
if ! grep -q '/swapfile' /etc/fstab; then
    echo "Configuring 2GB swap file..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    sysctl vm.swappiness=10
    echo 'vm.swappiness=10' >> /etc/sysctl.d/99-swappiness.conf
    echo "Swap configured successfully: $(free -h | grep -i swap)"
fi

# 2. Update system packages
echo "Updating apt repositories..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release git jq openssl

# 3. Install official Docker Engine and Docker Compose plugin
echo "Installing Docker Engine and Compose plugin..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Configure Docker daemon log rotation (prevents EBS disk exhaustion)
echo "Configuring Docker daemon log rotation..."
mkdir -p /etc/docker
cat <<'EOF' > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# 5. Enable Docker service and grant ubuntu user permissions
systemctl daemon-reload
systemctl enable docker
systemctl restart docker
usermod -aG docker ubuntu

# 6. Obtain project repository files
APP_DIR="/opt/smart-water-monitor"
REPO_URL="https://github.com/RishiSharma45/smart-water-monitoring-platform.git"
TARGET_BRANCH="main"

echo "Obtaining project repository from ${REPO_URL} (branch: ${TARGET_BRANCH})..."
if [ -d "${APP_DIR}/.git" ]; then
    cd "${APP_DIR}"
    git fetch origin "${TARGET_BRANCH}"
    git checkout "${TARGET_BRANCH}"
    git pull origin "${TARGET_BRANCH}" || true
else
    rm -rf "${APP_DIR}"
    git clone -b "${TARGET_BRANCH}" "${REPO_URL}" "${APP_DIR}"
fi
cd "${APP_DIR}"

DEPLOYED_COMMIT=$(git rev-parse HEAD)
echo "Checked out commit: ${DEPLOYED_COMMIT}"
echo "Commit timestamp: $(git log -1 --format=%cd)"
echo "Commit message: $(git log -1 --format=%s)"

# 7. Write the standalone production Docker Compose configuration
cat <<'EOF' > "${APP_DIR}/docker-compose.prod.yml"
x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  postgres:
    image: postgres:16
    container_name: smart-water-postgres
    restart: unless-stopped
    logging: *default-logging
    environment:
      POSTGRES_USER: ${DB_USER:-admin}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be configured in environment or .env file}
      POSTGRES_DB: ${DB_NAME:-waterdb}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./docker/db/init.sql:/docker-entrypoint-initdb.d/01-init.sql
      - ./docker/db/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-admin} -d ${DB_NAME:-waterdb}"]
      interval: 5s
      timeout: 5s
      retries: 5

  user-service:
    image: smart-water-monitor-user-service:${SMART_WATER_IMAGE_TAG:-prod}
    build:
      context: ./services/user-service
    container_name: user-service
    restart: unless-stopped
    logging: *default-logging
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      PORT: 3000
      DB_USER: ${DB_USER:-admin}
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be configured in environment or .env file}
      DB_NAME: ${DB_NAME:-waterdb}
      DB_HOST: postgres
      DB_PORT: 5432
    healthcheck:
      test: ["CMD-SHELL", "node -e \"fetch('http://localhost:3000/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\""]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  tank-service:
    image: smart-water-monitor-tank-service:${SMART_WATER_IMAGE_TAG:-prod}
    build:
      context: ./services/tank-service
    container_name: tank-service
    restart: unless-stopped
    logging: *default-logging
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      PORT: 3001
      DB_USER: ${DB_USER:-admin}
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be configured in environment or .env file}
      DB_NAME: ${DB_NAME:-waterdb}
      DB_HOST: postgres
      DB_PORT: 5432
      NOTIFICATION_SERVICE_URL: http://notification-service:3002
    healthcheck:
      test: ["CMD-SHELL", "node -e \"fetch('http://localhost:3001/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\""]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  notification-service:
    image: smart-water-monitor-notification-service:${SMART_WATER_IMAGE_TAG:-prod}
    build:
      context: ./services/notification-service
    container_name: notification-service
    restart: unless-stopped
    logging: *default-logging
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      PORT: 3002
      DB_USER: ${DB_USER:-admin}
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be configured in environment or .env file}
      DB_NAME: ${DB_NAME:-waterdb}
      DB_HOST: postgres
      DB_PORT: 5432
      EMAIL_ENABLED: ${EMAIL_ENABLED:-false}
      SMTP_HOST: ${SMTP_HOST:-}
      SMTP_PORT: ${SMTP_PORT:-587}
      SMTP_SECURE: ${SMTP_SECURE:-false}
      SMTP_USER: ${SMTP_USER:-}
      SMTP_PASSWORD: ${SMTP_PASSWORD:-}
      ALERT_EMAIL_FROM: ${ALERT_EMAIL_FROM:-}
      ALERT_EMAIL_TO: ${ALERT_EMAIL_TO:-}
      SLACK_ENABLED: ${SLACK_ENABLED:-false}
      SLACK_WEBHOOK_URL: ${SLACK_WEBHOOK_URL:-}
    healthcheck:
      test: ["CMD-SHELL", "node -e \"fetch('http://localhost:3002/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))\""]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  frontend:
    image: smart-water-monitor-frontend:${SMART_WATER_IMAGE_TAG:-prod}
    build:
      context: ./frontend
    container_name: smart-water-frontend
    restart: unless-stopped
    logging: *default-logging
    ports:
      - "80:80"
    depends_on:
      user-service:
        condition: service_healthy
      tank-service:
        condition: service_healthy
      notification-service:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:80/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  postgres_prod_data:
EOF

# 8. Create secure production environment file (.env) with generated random password
if [ ! -f "${APP_DIR}/.env" ]; then
    echo "Generating secure production credentials..."
    GEN_PASSWORD=$(openssl rand -hex 16)
    cat <<EOF > "${APP_DIR}/.env"
# Smart Water Monitor Production Environment (Auto-generated by EC2 user_data)
DB_USER=wateradmin
DB_PASSWORD=${GEN_PASSWORD}
DB_NAME=waterdb
SMART_WATER_IMAGE_TAG=prod
EMAIL_ENABLED=false
SLACK_ENABLED=false
EOF
    chmod 600 "${APP_DIR}/.env"
fi

# Set proper file permissions
chown -R ubuntu:ubuntu "${APP_DIR}"

# 9. Build images sequentially to keep memory spikes low on t3.micro
echo "Building production containers sequentially..."
cd "${APP_DIR}"
export NODE_OPTIONS="--max-old-space-size=512"

echo "Building user-service..."
docker compose -f docker-compose.prod.yml build user-service

echo "Building tank-service..."
docker compose -f docker-compose.prod.yml build tank-service

echo "Building notification-service..."
docker compose -f docker-compose.prod.yml build notification-service

echo "Building frontend..."
docker compose -f docker-compose.prod.yml build frontend

# 10. Launch all containers and verify startup
echo "Starting production containers..."
docker compose -f docker-compose.prod.yml up -d

echo "Monitoring container health for up to 60 seconds..."
for i in $(seq 1 12); do
    sleep 5
    STATUS=$(docker compose -f docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}")
    echo "Health check $i/12:"
    echo "$STATUS"
    if ! echo "$STATUS" | grep -q "unhealthy"; then
        if echo "$STATUS" | grep -q "healthy"; then
            echo "All required services report healthy."
            break
        fi
    fi
done

echo "SUCCESS" > /var/log/bootstrap-status
echo "=== Smart Water Monitor Bootstrap Completed Successfully at $(date -u) ==="
