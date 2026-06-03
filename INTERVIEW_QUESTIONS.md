# Interview Questions and Answers

## 1. What problem does this project solve?

It monitors water tank levels, detects low-water conditions, records alerts, and helps operators react before water availability becomes critical.

## 2. Why did you use microservices?

Microservices separate responsibilities. User management, tank operations, and notification logic can be developed, deployed, scaled, and monitored independently.

## 3. What is the role of PostgreSQL?

PostgreSQL stores persistent data including users, tanks, and generated alerts.

## 4. How does low-water alerting work?

When the tank service updates a water level, it calls the notification service. If the level is below 20 percent, the notification service inserts a low-water alert into PostgreSQL and increments a Prometheus metric.

## 5. What metrics are exposed?

The services expose HTTP request counts, request duration, error counts, service health, tank updates, total tanks, user registrations, and low-water alerts.

## 6. How does Prometheus work here?

Prometheus scrapes `/metrics` endpoints from all backend services and scrapes PostgreSQL metrics from postgres-exporter.

## 7. Why use Grafana?

Grafana visualizes Prometheus metrics and Loki logs through dashboards for application, infrastructure, PostgreSQL, and centralized logging.

## 8. What is Loki?

Loki is a log aggregation system. Promtail collects container logs and sends them to Loki. Grafana queries Loki for logs.

## 9. What production Kubernetes features are included?

The project includes namespace, services, deployments, readiness probes, liveness probes, resource requests and limits, HPA, PVC, Ingress, ConfigMaps, and Secrets.

## 10. What is the Jenkins pipeline flow?

GitHub webhook triggers Jenkins. Jenkins installs dependencies, builds the frontend, validates backend syntax, builds Docker images, pushes to Docker Hub, deploys to Kubernetes, verifies rollout, and rolls back on failure.

## 11. How is rollback handled?

If the pipeline fails, Jenkins runs `kubectl rollout undo` for frontend and backend deployments.

## 12. How are secrets handled?

Docker uses `.env` values. Kubernetes uses Secret manifests. A `secret.example.yaml` is provided for safe reference.

## 13. How do you verify the system?

Check Docker containers, backend health endpoints, Prometheus targets, Grafana dashboards, Loki logs, and the low-water alert workflow.

## 14. What improvements can be added later?

JWT authentication, role-based access control, managed cloud database, Helm charts, Terraform infrastructure, and real IoT sensor integration.

## 15. Why is this a DevOps portfolio project?

It demonstrates containerization, orchestration, CI/CD, observability, logging, alerting, rollback, and production documentation.
