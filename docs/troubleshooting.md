# Troubleshooting Guide

## Grafana Shows No Data

Check Prometheus targets:

```text
http://localhost:9090/targets
```

Generate traffic:

```powershell
curl http://localhost:3001/api/tanks
curl http://localhost:3002/api/alerts
```

Dashboards use `or vector(0)` for important panels, but rate-based charts still need recent request traffic.

## Kubernetes Pods Not Ready

```powershell
kubectl -n smart-water get pods
kubectl -n smart-water describe pod <pod-name>
kubectl -n smart-water logs <pod-name>
```

## PostgreSQL Data Missing

Check PVC:

```powershell
kubectl -n smart-water get pvc
```

## Prometheus Cannot Scrape Services

```powershell
kubectl -n smart-water get svc
kubectl -n smart-water port-forward svc/prometheus-service 9090:9090
```

Open:

```text
http://localhost:9090/targets
```

## Jenkins Deployment Fails

Check:

- Docker Desktop is running.
- Docker Desktop Kubernetes is enabled.
- Jenkins can run `docker`, `kubectl`, `node`, and `npm`.
- `kubectl config current-context` points to the intended local cluster, usually `docker-desktop`.
- Local image names match deployment container images.

See [Jenkins Troubleshooting](../TROUBLESHOOTING_JENKINS.md) for the full checklist.
