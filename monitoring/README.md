# Smart Water Monitor - Monitoring

This directory contains Prometheus, Grafana, Loki, Promtail, alert rules, dashboard provisioning, and PostgreSQL exporter support.

## Folder Structure

```text
monitoring/
  README.md
  prometheus/
    prometheus.yml
    rules/
      smart-water-alerts.yml
  grafana/
    dashboards/
      backend-apis.json
      infrastructure.json
      logging.json
      postgresql-metrics.json
      smart-water-overview.json
    provisioning/
      alerting/
        alert-rules.yml
        contact-points.yml
        notification-policies.yml
      dashboards/
        dashboards.yml
      datasources/
        prometheus.yml
  loki/
    loki.yml
  promtail/
    promtail.yml
```

## Files Created

```text
monitoring/README.md
monitoring/prometheus/prometheus.yml
monitoring/prometheus/rules/smart-water-alerts.yml
monitoring/grafana/provisioning/datasources/prometheus.yml
monitoring/grafana/provisioning/dashboards/dashboards.yml
monitoring/grafana/provisioning/alerting/contact-points.yml
monitoring/grafana/provisioning/alerting/notification-policies.yml
monitoring/grafana/provisioning/alerting/alert-rules.yml
monitoring/grafana/dashboards/smart-water-overview.json
monitoring/grafana/dashboards/backend-apis.json
monitoring/grafana/dashboards/infrastructure.json
monitoring/grafana/dashboards/postgresql-metrics.json
monitoring/grafana/dashboards/logging.json
monitoring/loki/loki.yml
monitoring/promtail/promtail.yml
k8s/monitoring/prometheus-deployment.yaml
k8s/monitoring/prometheus-service.yaml
k8s/monitoring/grafana-deployment.yaml
k8s/monitoring/grafana-service.yaml
k8s/monitoring/postgres-exporter-deployment.yaml
k8s/monitoring/postgres-exporter-service.yaml
k8s/logging/loki-deployment.yaml
k8s/logging/loki-service.yaml
k8s/logging/promtail-daemonset.yaml
```

## Application Metrics

Each backend service exposes:

```text
GET /metrics
```

Key metrics:

```text
smart_water_http_requests_total
smart_water_http_request_duration_seconds
smart_water_http_errors_total
smart_water_user_registrations_total
smart_water_tanks_total
smart_water_tank_updates_total
smart_water_low_water_alerts_total
smart_water_service_health
smart_water_process_cpu_user_seconds_total
smart_water_process_cpu_system_seconds_total
smart_water_process_resident_memory_bytes
pg_stat_database_numbackends
pg_database_size_bytes
```

## Docker Instructions

```powershell
docker compose up --build
```

Open:

```text
Prometheus: http://localhost:9090
Grafana:    http://localhost:3005
Loki:       http://localhost:3100
```

Grafana login:

```text
Username: admin
Password: admin
```

## Kubernetes Instructions

```powershell
kubectl apply -f k8s/monitoring/
kubectl apply -f k8s/logging/
```

Access:

```powershell
kubectl -n smart-water port-forward svc/prometheus-service 9090:9090
kubectl -n smart-water port-forward svc/grafana-service 3005:3005
kubectl -n smart-water port-forward svc/loki-service 3100:3100
```

## Notes

- Existing backend APIs are unchanged.
- Prometheus scrapes backend `/metrics` endpoints and PostgreSQL exporter.
- Grafana dashboards include overview, backend APIs, infrastructure, PostgreSQL, and logs.
- Dashboard PromQL uses `or vector(0)` where helpful to reduce empty panels before traffic exists.
- Logs are collected by Promtail and stored in Loki.
