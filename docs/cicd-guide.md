# CI/CD Guide

The Jenkins pipeline is designed for a local Windows Jenkins installation with Docker Desktop and Docker Desktop Kubernetes.

## Jenkins Credentials Required

No Jenkins credentials are required for the default local demo pipeline.

The pipeline does not require:

- Docker Hub credentials
- kubeconfig file credentials
- Slack credentials
- cloud provider credentials

Jenkins uses the local Docker and kubectl configuration available on the Windows machine where Jenkins runs.

## Pipeline Stages

```text
Checkout Source
Install Dependencies
Build Frontend
Validate Services
Build Docker Images
Deploy Kubernetes
Verify Deployment
```

## Image Names

Images are built locally with the same names used in the Kubernetes manifests:

```text
smart-water-monitor-frontend:latest
smart-water-monitor-user-service:latest
smart-water-monitor-tank-service:latest
smart-water-monitor-notification-service:latest
```

Because this is a local Docker Desktop deployment, images are not pushed to a remote registry.

## Deployment

The pipeline applies the core Kubernetes manifests and restarts the application deployments so the latest local images are used.

Rollout status is checked for:

- postgres
- frontend
- user-service
- tank-service
- notification-service

The final stage prints deployments, pods, and services in the `smart-water` namespace.
