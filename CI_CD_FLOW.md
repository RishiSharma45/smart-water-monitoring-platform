# CI/CD Flow

This project uses a simple Jenkins pipeline that is easy to explain and demonstrate.

## Flow Summary

```text
GitHub Push
-> Jenkins Auto Trigger
-> Checkout
-> Build
-> Deploy
-> Verify
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

### 1. Checkout

Jenkins checks out the repository and prints the current Git commit hash.

### 2. Build

Jenkins builds the frontend and all local Docker images:

```powershell
npm ci
npm run build
docker build --load -t smart-water-monitor-frontend:%BUILD_NUMBER% frontend
```

Images use the Jenkins build number:

```text
smart-water-monitor-frontend:${BUILD_NUMBER}
smart-water-monitor-user-service:${BUILD_NUMBER}
smart-water-monitor-tank-service:${BUILD_NUMBER}
smart-water-monitor-notification-service:${BUILD_NUMBER}
```

### 3. Deploy

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

After applying manifests, Jenkins updates each deployment with `kubectl set image` so Kubernetes rolls out the new `BUILD_NUMBER` tag.

### 4. Verify

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
