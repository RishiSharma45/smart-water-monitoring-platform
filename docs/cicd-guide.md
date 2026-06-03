# CI/CD Guide

## Jenkins Credentials Required

Create these Jenkins credentials:

```text
docker-registry-namespace
docker-registry-credentials
kubeconfig
```

## Pipeline Stages

```text
Checkout
Install Dependencies
Build Frontend
Validate Backend Syntax
Docker Build
Docker Push
Kubernetes Deploy
Verify Rollout
Rollback Preview
```

Rollback runs automatically in the post-failure block.

## Image Tagging

Images are tagged as:

```text
BUILD_NUMBER-GIT_SHA
```

Example:

```text
25-a1b2c3d
```
