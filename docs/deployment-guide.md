# Deployment Guide

## Docker Compose Deployment

```powershell
copy .env.example .env
docker compose up --build -d
docker compose ps
```

## Kubernetes Deployment

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

For a completely fresh Kubernetes database, the PostgreSQL init ConfigMap runs automatically during the first start of the Postgres container. If `postgres-pvc` already contains data, the init scripts are skipped by PostgreSQL.

## Rollout Verification

```powershell
kubectl -n smart-water get pods
kubectl -n smart-water rollout status deployment/frontend
kubectl -n smart-water rollout status deployment/user-service
kubectl -n smart-water rollout status deployment/tank-service
kubectl -n smart-water rollout status deployment/notification-service
```

## Rollback

```powershell
kubectl -n smart-water rollout undo deployment/frontend
kubectl -n smart-water rollout undo deployment/user-service
kubectl -n smart-water rollout undo deployment/tank-service
kubectl -n smart-water rollout undo deployment/notification-service
```
