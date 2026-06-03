# Jenkins Setup for Smart Water Monitoring Platform

This guide configures Jenkins to build and deploy the project automatically when code is pushed to GitHub.

## 1. Required Local Tools

Install these on the Windows machine running Jenkins:

- Git
- Node.js LTS and npm
- Docker Desktop
- kubectl
- Jenkins LTS

Enable Kubernetes in Docker Desktop:

1. Open Docker Desktop.
2. Go to Settings > Kubernetes.
3. Enable Kubernetes.
4. Wait until Docker Desktop shows Kubernetes is running.

Verify from PowerShell:

```powershell
git --version
node --version
npm --version
docker version
kubectl config current-context
kubectl get nodes
```

The Kubernetes context should normally be:

```text
docker-desktop
```

## 2. Jenkins Plugins

Install these Jenkins plugins:

- Git
- GitHub
- Pipeline
- Pipeline: Stage View

No Docker Hub, Slack, cloud, or paid-service plugins are required.

## 3. Jenkins PATH on Windows

Jenkins must be able to run `git`, `node`, `npm`, `docker`, and `kubectl`.

If Jenkins runs as a Windows service:

1. Open Services.
2. Find Jenkins.
3. Confirm the service account can access Docker Desktop.
4. Add tool folders to the system `PATH`.
5. Restart Jenkins.

Common tool paths:

```text
C:\Program Files\Git\cmd
C:\Program Files\nodejs
C:\Program Files\Docker\Docker\resources\bin
```

If `kubectl` is installed separately, add its folder to `PATH` too.

## 4. Create Jenkins Pipeline Job

1. Open Jenkins.
2. Select New Item.
3. Enter a job name, for example `smart-water-monitor`.
4. Choose Pipeline.
5. Under Build Triggers, enable GitHub hook trigger for GITScm polling.
6. Under Pipeline, choose Pipeline script from SCM.
7. Select Git.
8. Enter the GitHub repository URL.
9. Set the branch, for example `main`.
10. Set Script Path to `Jenkinsfile`.
11. Save.

## 5. GitHub Webhook Setup

In GitHub:

1. Open the repository.
2. Go to Settings > Webhooks.
3. Select Add webhook.
4. Payload URL:

```text
http://YOUR_JENKINS_HOST:8080/github-webhook/
```

5. Content type:

```text
application/json
```

6. Select Just the push event.
7. Enable Active.
8. Save the webhook.

For a local Jenkins demo, use a tunnel such as ngrok only if GitHub needs to reach Jenkins over the internet. For viva demonstration, you can also click Build Now manually and explain that the same Jenkinsfile is triggered by the webhook on push.

## 6. First Run Checklist

Before running the job:

- Docker Desktop is running.
- Docker Desktop Kubernetes is enabled.
- `kubectl config current-context` points to `docker-desktop`.
- Jenkins can run Docker commands.
- Jenkins can run kubectl commands.
- The repository contains `k8s/secret.yaml` for local demo credentials.

Start a build from Jenkins or push to GitHub.

## 7. Expected Pipeline Stages

The Jenkins job should show these stages:

1. Checkout Source
2. Install Dependencies
3. Build Frontend
4. Validate Services
5. Build Docker Images
6. Deploy Kubernetes
7. Verify Deployment

At the end, Jenkins prints deployments, pods, and services from the `smart-water` namespace.
