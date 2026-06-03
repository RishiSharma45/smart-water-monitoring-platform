# Demo Guide

This guide is for the final college project demonstration.

## 1. Start With the Architecture

Explain the flow:

```text
React Frontend
-> Node.js Microservices
-> PostgreSQL
-> Prometheus/Grafana/Loki
-> Docker + Kubernetes
-> Jenkins CI/CD
```

## 2. Docker Compose Demo

Run:

```powershell
copy .env.example .env
docker compose up --build
```

Open:

```text
Frontend:   http://localhost:5173
Prometheus: http://localhost:9090
Grafana:    http://localhost:3005
```

Grafana login:

```text
admin/admin
```

Show:

- Dashboard page.
- Tanks page with Main Tank and Backup Tank.
- Alerts page after setting a tank below 20%.
- Prometheus targets.
- Grafana Smart Water dashboard.

## 3. Kubernetes Demo

Make sure Docker Desktop Kubernetes is enabled.

Apply manifests:

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres-init-configmap.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/
kubectl apply -f k8s/hpa/
kubectl apply -f k8s/monitoring/
kubectl apply -f k8s/logging/
```

Verify:

```powershell
kubectl get pods -n smart-water
kubectl -n smart-water get services
kubectl -n smart-water rollout status deployment/frontend
kubectl -n smart-water rollout status deployment/user-service
kubectl -n smart-water rollout status deployment/tank-service
kubectl -n smart-water rollout status deployment/notification-service
```

Port forward:

```powershell
kubectl -n smart-water port-forward svc/frontend-service 5173:80
kubectl -n smart-water port-forward svc/prometheus-service 9090:9090
kubectl -n smart-water port-forward svc/grafana-service 3005:3000
```

## 4. Jenkins Demo

Show the Jenkinsfile stages:

1. Checkout Source
2. Build Frontend
3. Build Docker Images
4. Deploy Kubernetes
5. Verify Deployment

Explain:

- GitHub webhook triggers Jenkins on push.
- Jenkins builds local Docker images.
- Jenkins applies Kubernetes manifests.
- Jenkins verifies rollout with `kubectl rollout status`.

## 5. Database Initialization Demo

Explain that PostgreSQL initialization is automatic on a fresh PVC:

- `docker/db/init.sql` creates tables.
- `docker/db/seed.sql` inserts seed tanks.
- `k8s/postgres-init-configmap.yaml` mounts SQL files into `/docker-entrypoint-initdb.d`.

Important: PostgreSQL runs init scripts only when the database volume is empty.

## 6. Suggested Viva Flow

1. Show README and architecture.
2. Run or show Docker Compose stack.
3. Show Kubernetes pods running.
4. Open frontend dashboard.
5. Update a tank level.
6. Show alert generation.
7. Show Prometheus targets.
8. Show Grafana dashboard.
9. Show Jenkins successful build.
10. Explain database auto-init.
