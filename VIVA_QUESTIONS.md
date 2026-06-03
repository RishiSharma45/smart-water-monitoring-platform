# Viva Questions

## Project Basics

**Q: What problem does this project solve?**  
A: It monitors water tank levels, stores tank data, generates low-water alerts, and provides dashboards for application and infrastructure visibility.

**Q: What are the main modules?**  
A: React frontend, User Service, Tank Service, Notification Service, PostgreSQL, Docker, Kubernetes, Prometheus, Grafana, Loki, and Jenkins.

**Q: Why did you use microservices?**  
A: To separate responsibilities. User operations, tank operations, and notifications can be developed, deployed, and monitored independently.

## Frontend

**Q: Why React and Vite?**  
A: React provides component-based UI development, and Vite gives fast development and optimized production builds.

**Q: How does the frontend communicate with services?**  
A: It uses Axios to call backend REST APIs for tanks, alerts, and health information.

## Backend

**Q: What does the Tank Service do?**  
A: It manages tank records, water level updates, and calls the Notification Service when tank levels change.

**Q: What does the Notification Service do?**  
A: It checks low-water conditions and stores alerts in PostgreSQL.

**Q: Did you modify business APIs for deployment?**  
A: No. Deployment and CI/CD changes are separate from business API behavior.

## Database

**Q: Which database is used?**  
A: PostgreSQL.

**Q: How are tables created in Kubernetes?**  
A: SQL scripts are mounted into `/docker-entrypoint-initdb.d` using a Kubernetes ConfigMap, so PostgreSQL runs them automatically on first startup.

**Q: What seed data is inserted?**  
A: Main Tank with 75% and Backup Tank with 40%.

**Q: Why do init scripts not rerun every restart?**  
A: The official PostgreSQL image only runs init scripts when the data directory is empty. Existing PVC data is preserved.

## Docker

**Q: Why Docker?**  
A: Docker packages each service with its runtime and dependencies, making local and Kubernetes deployments consistent.

**Q: What does Docker Compose provide?**  
A: It starts the full local stack: frontend, backend services, PostgreSQL, Prometheus, Grafana, Loki, Promtail, and PostgreSQL Exporter.

## Kubernetes

**Q: Why Kubernetes?**  
A: Kubernetes manages container deployments, services, probes, scaling, and rollouts.

**Q: What is a readiness probe?**  
A: It tells Kubernetes when a pod is ready to receive traffic.

**Q: What is a liveness probe?**  
A: It tells Kubernetes when a container should be restarted because it is unhealthy.

**Q: What is a PVC?**  
A: A PersistentVolumeClaim provides persistent storage for PostgreSQL data.

## Monitoring

**Q: Why Prometheus?**  
A: Prometheus collects metrics from backend services and infrastructure exporters.

**Q: Why Grafana?**  
A: Grafana visualizes Prometheus and Loki data through dashboards.

**Q: Why Loki and Promtail?**  
A: Loki stores logs, and Promtail ships logs from containers or Kubernetes pods.

## Jenkins

**Q: What triggers the Jenkins pipeline?**  
A: A GitHub webhook triggers Jenkins whenever code is pushed.

**Q: What are the Jenkins stages?**  
A: Checkout Source, Build Frontend, Build Docker Images, Deploy Kubernetes, and Verify Deployment.

**Q: Why is the pipeline simple?**  
A: It is designed for a reliable college demonstration without paid services, Docker Hub credentials, cloud credentials, or Slack integrations.

**Q: How does Jenkins verify deployment?**  
A: It runs `kubectl rollout status` and prints deployments, pods, and services.

## Final Explanation

**Q: What makes this project production-inspired?**  
A: It includes containerization, Kubernetes manifests, probes, resource limits, CI/CD, metrics, dashboards, logs, and database initialization.

**Q: What makes it suitable for college submission?**  
A: It is complete, demonstrable locally, documented, and does not depend on paid cloud services.
