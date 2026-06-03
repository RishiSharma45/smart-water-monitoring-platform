# Monitoring Guide

## Metrics Endpoints

```text
user-service:3000/metrics
tank-service:3001/metrics
notification-service:3002/metrics
postgres-exporter:9187/metrics
```

## Key Metrics

```text
smart_water_http_requests_total
smart_water_http_request_duration_seconds
smart_water_http_errors_total
smart_water_user_registrations_total
smart_water_tanks_total
smart_water_tank_updates_total
smart_water_low_water_alerts_total
smart_water_service_health
pg_stat_database_numbackends
pg_database_size_bytes
```

## Prometheus

```text
http://localhost:9090/targets
```

All backend targets and PostgreSQL exporter should be `UP`.

## Grafana

```text
http://localhost:3005
```

Login:

```text
admin/admin
```

Dashboards:

- Smart Water Overview
- Backend APIs
- Infrastructure
- PostgreSQL Metrics
- Centralized Logging

## Alerts

Prometheus alert rules are in:

```text
monitoring/prometheus/rules/smart-water-alerts.yml
```

Grafana alert provisioning is in:

```text
monitoring/grafana/provisioning/alerting/
```
