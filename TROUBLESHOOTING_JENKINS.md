# Jenkins Troubleshooting

Use this guide when the Jenkins pipeline fails on Windows with Docker Desktop.

## Jenkins Cannot Find npm, Docker, or kubectl

Error examples:

```text
'npm' is not recognized
'docker' is not recognized
'kubectl' is not recognized
```

Fix:

1. Add the tool folders to the Windows system `PATH`.
2. Restart the Jenkins service.
3. Run the pipeline again.

Common paths:

```text
C:\Program Files\nodejs
C:\Program Files\Git\cmd
C:\Program Files\Docker\Docker\resources\bin
```

## Docker Command Fails

Error examples:

```text
Cannot connect to the Docker daemon
error during connect
```

Fix:

1. Start Docker Desktop.
2. Wait until Docker Desktop is fully running.
3. Confirm Jenkins is running under a Windows user that can access Docker Desktop.
4. Run this in PowerShell:

```powershell
docker version
```

If it works in PowerShell but not Jenkins, restart Jenkins after updating the service account or PATH.

## kubectl Cannot Connect to Kubernetes

Error examples:

```text
The connection to the server localhost:8080 was refused
Unable to connect to the server
```

Fix:

1. Open Docker Desktop.
2. Enable Kubernetes in Settings > Kubernetes.
3. Wait until Kubernetes is running.
4. Check the current context:

```powershell
kubectl config current-context
kubectl get nodes
```

For Docker Desktop, use:

```powershell
kubectl config use-context docker-desktop
```

## Pods Stay in ImagePullBackOff

Cause:

Kubernetes cannot find the image locally or is trying to pull it from a remote registry.

Fix:

1. Confirm the Jenkins Docker build stage completed.
2. Confirm image names:

```powershell
docker images | findstr smart-water-monitor
```

3. Confirm deployment manifests use these local images:

```text
smart-water-monitor-frontend:latest
smart-water-monitor-user-service:latest
smart-water-monitor-tank-service:latest
smart-water-monitor-notification-service:latest
```

4. Confirm deployments use `imagePullPolicy: IfNotPresent`.

## Rollout Verification Times Out

Check pod status:

```powershell
kubectl -n smart-water get pods -o wide
kubectl -n smart-water describe pod POD_NAME
```

Common causes:

- PostgreSQL is still starting.
- Docker Desktop has low CPU or memory.
- A readiness probe is failing.
- The app cannot connect to PostgreSQL.

Useful logs:

```powershell
kubectl -n smart-water logs deployment/postgres
kubectl -n smart-water logs deployment/user-service
kubectl -n smart-water logs deployment/tank-service
kubectl -n smart-water logs deployment/notification-service
kubectl -n smart-water logs deployment/frontend
```

## GitHub Webhook Does Not Trigger Jenkins

Check:

- Jenkins job has GitHub hook trigger for GITScm polling enabled.
- GitHub webhook URL ends with `/github-webhook/`.
- Jenkins is reachable from GitHub.
- The webhook event is set to push.

For local Jenkins, GitHub cannot reach `localhost`. Use a tunnel for automatic public webhook testing, or use Build Now during local viva demonstration.

## npm ci Fails

Fix:

1. Confirm Node.js LTS is installed.
2. Confirm each project folder has a lock file.
3. Run locally:

```powershell
cd frontend
npm ci
```

Then repeat for each service folder.

## Clean Re-Deploy

If Kubernetes resources need a fresh start:

```powershell
kubectl delete namespace smart-water
```

Then run the Jenkins build again.

Only use this for demos or local cleanup because it removes the local PostgreSQL PVC in the namespace.
