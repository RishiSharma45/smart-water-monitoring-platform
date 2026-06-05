# Project Architecture

## Overview

Smart Water Monitoring Platform is a containerized microservices project for monitoring water tank levels, generating low-water alerts, and visualizing system health.

## Main Components

```mermaid
flowchart LR
    Browser["Browser"] --> Frontend["React Frontend"]
    Frontend --> User["User Service"]
    Frontend --> Tank["Tank Service"]
    Frontend --> Notify["Notification Service"]
    Tank --> Notify
    User --> DB["PostgreSQL"]
    Tank --> DB
    Notify --> DB
    Prom["Prometheus"] --> User
    Prom --> Tank
    Prom --> Notify
    PgExporter["PostgreSQL Exporter"] --> DB
    Prom --> PgExporter
    Grafana["Grafana"] --> Prom
    Promtail["Promtail"] --> Loki["Loki"]
    Grafana --> Loki
```

## Frontend

- Built with React and Vite.
- Shows dashboard metrics, tank levels, alerts, and system health.
- Communicates with backend APIs through Axios.

## Backend Services

### User Service

- Manages users.
- Exposes health and Prometheus metrics endpoints.
- Connects to PostgreSQL.

### Tank Service

- Creates tanks.
- Reads tank data.
- Updates water level.
- Calls Notification Service when water level changes.

### Notification Service

- Checks low-water conditions.
- Stores alerts in PostgreSQL.
- Keeps email/notification configuration optional and disabled for local demos.

## Database

PostgreSQL stores:

- `users`
- `tanks`
- `alerts`

On a fresh Kubernetes database, SQL scripts are mounted through `k8s/postgres-init-configmap.yaml` and executed automatically by the official PostgreSQL image.

Seed data:

- Main Tank: 75%
- Backup Tank: 40%

## Deployment Architecture

Docker Compose is used for local development. Kubernetes is used for orchestration and final deployment demonstration.

```mermaid
flowchart TB
    subgraph K8s["smart-water namespace"]
        FE["frontend deployment"]
        US["user-service deployment"]
        TS["tank-service deployment"]
        NS["notification-service deployment"]
        PG["postgres deployment + PVC"]
        PM["prometheus deployment"]
        GF["grafana deployment"]
        LK["loki deployment"]
        PT["promtail daemonset"]
    end
```

## CI/CD

```mermaid
flowchart LR
    GitHub["GitHub Push"] --> Jenkins["Jenkins Webhook Trigger"]
    Jenkins --> Build["Build frontend and Docker images"]
    Build --> K8sDeploy["Deploy manifests and set BUILD_NUMBER images"]
    K8sDeploy --> Verify["Verify Rollout"]
    Verify --> Success["Success"]
```

The Jenkins pipeline is intentionally simple for a college viva and runs against local Docker Desktop Kubernetes.

## Observability

- Prometheus scrapes backend `/metrics` endpoints.
- Grafana provisions datasources and dashboards.
- Loki stores logs.
- Promtail ships logs to Loki.
- PostgreSQL Exporter exposes database metrics.
