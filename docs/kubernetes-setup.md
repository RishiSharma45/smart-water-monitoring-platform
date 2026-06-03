# Kubernetes Setup Guide

## Included Production Features

- Namespace: `smart-water`
- ConfigMap and Secret separation
- PostgreSQL PVC
- Readiness and liveness probes
- CPU and memory requests/limits
- Horizontal Pod Autoscalers
- Ingress
- Prometheus and Grafana
- Loki and Promtail
- PostgreSQL exporter

## Apply Order

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/user-deployment.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/tank-deployment.yaml
kubectl apply -f k8s/tank-service.yaml
kubectl apply -f k8s/notification-deployment.yaml
kubectl apply -f k8s/notification-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/hpa/
kubectl apply -f k8s/monitoring/
kubectl apply -f k8s/logging/
kubectl apply -f k8s/ingress.yaml
```

## Port Forwarding

```powershell
kubectl -n smart-water port-forward svc/frontend-service 5173:80
kubectl -n smart-water port-forward svc/prometheus-service 9090:9090
kubectl -n smart-water port-forward svc/grafana-service 3005:3005
```
