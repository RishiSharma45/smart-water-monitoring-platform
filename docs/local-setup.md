# Local Setup Guide

## Prerequisites

- Node.js 20+
- Docker Desktop
- Docker Compose

## Environment

```powershell
copy .env.example .env
```

Update `.env` before production demos.

## Run Full Stack

```powershell
docker compose up --build
```

## Access URLs

```text
Frontend:   http://localhost:5173
User API:   http://localhost:3000
Tank API:   http://localhost:3001
Alerts API: http://localhost:3002
Prometheus: http://localhost:9090
Grafana:    http://localhost:3005
```

## Useful API Checks

```powershell
curl http://localhost:3000/health/ready
curl http://localhost:3001/health/ready
curl http://localhost:3002/health/ready
curl http://localhost:3000/metrics
```
