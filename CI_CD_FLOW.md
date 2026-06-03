# CI/CD Flow

This project uses a simple Jenkins pipeline that is easy to explain and demonstrate.

## Flow Summary

```text
GitHub Push
-> Jenkins Auto Trigger
-> Checkout Source
-> Build Frontend
-> Build Docker Images
-> Deploy Kubernetes
-> Verify Deployment
-> SUCCESS
```

## What Was Simplified

The previous pipeline used Docker Hub credentials, kubeconfig credentials, registry image pushes, and rollback logic. Those features are useful in larger production systems, but they add unnecessary setup for a college-level local demo.

The improved pipeline:

- Keeps the GitHub webhook trigger.
- Keeps Git checkout.
- Keeps frontend build.
- Keeps Docker image builds.
- Keeps Kubernetes deployment.
- Keeps rollout verification.
- Removes Docker Hub push requirements.
- Removes cloud-specific kubeconfig credentials.
- Removes Slack notification dependencies.
- Uses local Docker Desktop and local Kubernetes.

## Stage Details

### 1. Checkout Source

Jenkins checks out the repository and prints the current Git commit hash.

### 2. Build Frontend

Jenkins runs:

```powershell
npm ci
npm run build
```

This installs frontend dependencies from the lock file and verifies that the React/Vite frontend compiles successfully.

### 3. Build Docker Images

Jenkins builds the local Docker images used by Kubernetes:

```text
smart-water-monitor-frontend:latest
smart-water-monitor-user-service:latest
smart-water-monitor-tank-service:latest
smart-water-monitor-notification-service:latest
```

These names match the image names already referenced in the Kubernetes deployment manifests.

### 4. Deploy Kubernetes

Jenkins applies the core manifests:

- Namespace
- ConfigMap
- Secret
- PostgreSQL PVC, Deployment, and Service
- User Service Deployment and Service
- Tank Service Deployment and Service
- Notification Service Deployment and Service
- Frontend Deployment and Service
- Ingress

After applying manifests, Jenkins restarts the application deployments so Kubernetes uses the latest locally built Docker images.

### 5. Verify Deployment

Jenkins checks rollout status for:

- `postgres`
- `frontend`
- `user-service`
- `tank-service`
- `notification-service`

Then it prints:

- deployments
- pods
- services

This gives clear proof during a viva that the deployment succeeded.

## Why This Fits a College Viva

The pipeline shows the complete DevOps path without paid services:

- GitHub provides source control and webhook events.
- Jenkins performs CI/CD automation.
- Docker Desktop builds local container images.
- Docker Desktop Kubernetes deploys the application.
- kubectl output proves the rollout.

The result is professional, but still practical to run on a student laptop.
