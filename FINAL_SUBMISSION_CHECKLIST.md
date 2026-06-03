# Final Submission Checklist

Use this checklist before submitting or presenting the Smart Water Monitoring Platform.

## Repository

- [ ] Repository opens from a clean clone.
- [ ] `README.md` explains the project, stack, Docker, Kubernetes, monitoring, and Jenkins flow.
- [ ] No paid services are required for the main demo.
- [ ] No cloud credentials are required.
- [ ] No Slack webhook or external notification dependency is required.
- [ ] `.env.example` is present for local configuration.

## Application

- [ ] React frontend builds successfully.
- [ ] User Service starts on port `3000`.
- [ ] Tank Service starts on port `3001`.
- [ ] Notification Service starts on port `3002`.
- [ ] PostgreSQL starts with database `waterdb`.
- [ ] Main Tank and Backup Tank seed data appear on a fresh database.
- [ ] Tank update flow creates low-water alerts when water level is low.

## Docker Compose

- [ ] `docker compose config` succeeds.
- [ ] `docker compose up --build` starts the stack.
- [ ] Frontend opens at `http://localhost:5173`.
- [ ] Prometheus opens at `http://localhost:9090`.
- [ ] Grafana opens at `http://localhost:3005`.
- [ ] Grafana login works with `admin/admin`.
- [ ] Prometheus targets show backend services as `UP`.

## Kubernetes

- [ ] Docker Desktop Kubernetes is enabled.
- [ ] `kubectl config current-context` points to `docker-desktop`.
- [ ] PostgreSQL init ConfigMap is applied before PostgreSQL deployment.
- [ ] Backend probes match working service endpoints.
- [ ] `kubectl get pods -n smart-water` shows `READY 1/1` and `STATUS Running`.
- [ ] Rollout status succeeds for frontend and all backend services.

## Jenkins

- [ ] Jenkins has Git, GitHub, and Pipeline plugins installed.
- [ ] Jenkins can run `git`, `node`, `npm`, `docker`, and `kubectl`.
- [ ] GitHub webhook points to `/github-webhook/`.
- [ ] Pipeline stages are simple and viva-friendly:
  - Checkout Source
  - Build Frontend
  - Build Docker Images
  - Deploy Kubernetes
  - Verify Deployment

## Monitoring

- [ ] Prometheus scrapes all backend `/metrics` endpoints.
- [ ] Grafana datasource provisioning works.
- [ ] Grafana dashboards load.
- [ ] Loki datasource is configured.
- [ ] Promtail is configured for Docker Compose and Kubernetes logging.

## Viva Evidence

- [ ] Screenshot of React Dashboard.
- [ ] Screenshot of Tanks page with seed tanks.
- [ ] Screenshot of Alerts page after low-water update.
- [ ] Screenshot of `kubectl get pods -n smart-water`.
- [ ] Screenshot of Jenkins successful pipeline.
- [ ] Screenshot of Prometheus targets.
- [ ] Screenshot of Grafana dashboard.
