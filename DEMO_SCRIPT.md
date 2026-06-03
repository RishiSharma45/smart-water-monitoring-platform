# Demo Script

## 1. Project Introduction

Say:

> This is a production-ready Smart Water Monitoring Platform built using React, Node.js microservices, PostgreSQL, Docker, Kubernetes, Jenkins, Prometheus, Grafana, Loki, and Promtail.

## 2. Show Architecture

Open:

```text
README.md
docs/architecture.md
```

Explain:

- React frontend calls backend APIs.
- Tank service updates tank levels.
- Notification service generates low-water alerts.
- PostgreSQL stores users, tanks, and alerts.
- Prometheus scrapes metrics.
- Grafana visualizes dashboards.
- Loki stores logs.

## 3. Start Docker Stack

Run:

```powershell
docker compose up -d --build
docker compose ps
```

Show all containers running.

## 4. Show Frontend

Open:

```text
http://localhost:5173
```

Demonstrate:

- Dashboard metrics
- Tank status
- Alerts page
- System Health page

## 5. Trigger Low Water Alert

Run:

```powershell
Invoke-WebRequest -UseBasicParsing -Method Put -ContentType 'application/json' -Body '{"water_level":10}' http://localhost:3001/api/tanks/1
```

Show:

- Tank level updated
- Alert generated
- Alert visible on frontend

## 6. Show Prometheus

Open:

```text
http://localhost:9090/targets
```

Show targets:

- user-service
- tank-service
- notification-service
- postgres-exporter

Run Prometheus queries:

```text
smart_water_tank_updates_total
smart_water_low_water_alerts_total
smart_water_tanks_total
pg_stat_database_numbackends
```

## 7. Show Grafana

Open:

```text
http://localhost:3005
```

Login:

```text
admin/admin
```

Show dashboards:

- Smart Water Overview
- Backend APIs
- Infrastructure
- PostgreSQL Metrics
- Centralized Logging

## 8. Show Loki Logs

Open Grafana dashboard:

```text
Centralized Logging
```

Explain:

- Promtail collects Docker logs.
- Loki stores logs.
- Grafana queries logs.

## 9. Show Kubernetes

Open:

```text
k8s/
```

Explain:

- Namespace
- Deployments
- Services
- ConfigMap
- Secret
- PVC
- HPA
- Ingress
- Monitoring
- Logging

## 10. Show Jenkins CI/CD

Open:

```text
Jenkinsfile
```

Explain:

- GitHub webhook triggers pipeline.
- Jenkins builds Docker images.
- Images are pushed to Docker Hub.
- Kubernetes is deployed automatically.
- Rollback runs if deployment fails.
- Slack notification is sent after success/failure.

## 11. Closing Statement

Say:

> This project demonstrates full-stack development and DevOps skills: microservices, Docker, Kubernetes, CI/CD, observability, logging, alerting, and production-ready documentation.
