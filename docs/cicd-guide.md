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
Checkout
Build
Deploy
Verify
```

## Image Names

Images are built locally with the Jenkins `BUILD_NUMBER` tag:

```text
smart-water-monitor-frontend:${BUILD_NUMBER}
smart-water-monitor-user-service:${BUILD_NUMBER}
smart-water-monitor-tank-service:${BUILD_NUMBER}
smart-water-monitor-notification-service:${BUILD_NUMBER}
```

Because this is a local Docker Desktop deployment, images are not pushed to a remote registry.

## Deployment

The pipeline applies the core Kubernetes manifests, then runs `kubectl set image` so each deployment uses the new `BUILD_NUMBER` image. This avoids stale `latest` or manually edited tags.

Rollout status is checked for:

- postgres
- frontend
- user-service
- tank-service
- notification-service

The final stage prints deployments, pods, and services in the `smart-water` namespace.
