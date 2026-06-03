# Final Project Checklist

## Application

- [ ] React frontend opens successfully.
- [ ] Dashboard loads tank and alert data.
- [ ] Tanks page displays all tanks.
- [ ] Create tank form works.
- [ ] Update water level form works.
- [ ] Alerts page displays alert history.
- [ ] System Health page shows service readiness.

## Backend

- [ ] User service runs on port 3000.
- [ ] Tank service runs on port 3001.
- [ ] Notification service runs on port 3002.
- [ ] `/health/live` works on every backend service.
- [ ] `/health/ready` works on every backend service.
- [ ] `/metrics` works on every backend service.

## Database

- [ ] PostgreSQL container/pod starts.
- [ ] Tables exist: users, tanks, alerts.
- [ ] Seed tanks are available.
- [ ] PostgreSQL exporter exposes metrics.

## Docker

- [ ] `docker compose config` succeeds.
- [ ] `docker compose up -d --build` succeeds.
- [ ] All containers are healthy/running.
- [ ] Frontend is available on `5173`.
- [ ] Prometheus is available on `9090`.
- [ ] Grafana is available on `3005`.
- [ ] Loki is available on `3100`.

## Kubernetes

- [ ] Namespace exists.
- [ ] ConfigMap exists.
- [ ] Secret exists.
- [ ] PostgreSQL PVC is bound.
- [ ] Deployments are ready.
- [ ] Services are created.
- [ ] HPA objects are created.
- [ ] Ingress is created.
- [ ] Monitoring manifests are applied.
- [ ] Logging manifests are applied.

## Monitoring

- [ ] Prometheus targets are UP.
- [ ] `smart_water_tanks_total` returns data.
- [ ] `smart_water_tank_updates_total` returns data.
- [ ] `smart_water_low_water_alerts_total` returns data.
- [ ] `smart_water_http_requests_total` returns data.
- [ ] PostgreSQL metrics return data.
- [ ] Prometheus alert rules are loaded.

## Grafana

- [ ] Prometheus datasource is provisioned.
- [ ] Loki datasource is provisioned.
- [ ] Smart Water Overview dashboard is visible.
- [ ] Backend APIs dashboard is visible.
- [ ] Infrastructure dashboard is visible.
- [ ] PostgreSQL Metrics dashboard is visible.
- [ ] Centralized Logging dashboard is visible.

## Logging

- [ ] Loki is ready.
- [ ] Promtail is running.
- [ ] Backend logs are visible in Loki.
- [ ] Grafana log dashboard displays logs.

## CI/CD

- [ ] Jenkinsfile is present.
- [ ] GitHub webhook trigger is configured.
- [ ] Docker Hub credentials exist in Jenkins.
- [ ] Kubeconfig credential exists in Jenkins.
- [ ] Slack webhook credential exists in Jenkins.
- [ ] Pipeline builds Docker images.
- [ ] Pipeline pushes Docker images.
- [ ] Pipeline deploys to Kubernetes.
- [ ] Pipeline verifies rollout.
- [ ] Pipeline rolls back on failure.
- [ ] Pipeline sends Slack notifications.

## Documentation

- [ ] README is complete.
- [ ] Architecture diagrams are present.
- [ ] Sequence diagram is present.
- [ ] Deployment diagram is present.
- [ ] Demo script is present.
- [ ] Final project report is present.
- [ ] Interview questions are present.
- [ ] Resume description is present.
