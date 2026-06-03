# Final Project Report

## Project Title

Smart Water Monitoring Platform

## Objective

The objective of this project is to build a production-ready cloud-native Smart Water Monitoring Platform that monitors water tanks, records tank levels, generates low-water alerts, and demonstrates modern DevOps practices including Docker, Kubernetes, CI/CD, monitoring, logging, and alerting.

## Problem Statement

Manual water tank monitoring is inefficient and reactive. Institutions and buildings need a reliable system to track water levels, detect low-water conditions, and notify operators before water availability becomes critical.

## Proposed Solution

The platform provides a React dashboard connected to Node.js microservices. It stores tank and alert data in PostgreSQL, exposes Prometheus metrics, visualizes system behavior in Grafana, collects logs through Loki/Promtail, and deploys through Docker Compose or Kubernetes.

## Architecture Summary

The system follows a microservices architecture:

- Frontend: React and Vite
- User Service: user registration and user listing
- Tank Service: tank creation, listing, and level updates
- Notification Service: low-water alert detection and alert history
- Database: PostgreSQL
- Monitoring: Prometheus, Grafana, PostgreSQL Exporter
- Logging: Loki and Promtail
- CI/CD: Jenkins with Docker Hub and Kubernetes deployment

## Key Features

- Responsive React dashboard
- Tank inventory management
- Tank level update workflow
- Low-water alert generation
- Alert history tracking
- Service health checks
- Prometheus metrics
- Grafana dashboards
- PostgreSQL metrics
- Centralized logging
- Kubernetes readiness and liveness probes
- Resource requests and limits
- Horizontal Pod Autoscalers
- Persistent PostgreSQL storage
- Jenkins pipeline with rollback
- Docker Hub image publishing
- GitHub webhook trigger support
- Optional Slack and email notifications

## Technologies Used

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Axios, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes |
| Monitoring | Prometheus, Grafana |
| Logging | Loki, Promtail |
| CI/CD | Jenkins |
| Registry | Docker Hub |

## Testing and Verification

The project was verified using:

- Frontend production build
- Backend syntax checks
- Docker Compose deployment
- Backend health endpoints
- Prometheus target checks
- Prometheus custom metric queries
- Grafana dashboard provisioning check
- Loki readiness and log query check
- Notification workflow test

## Learning Outcomes

- Designed and deployed microservices
- Integrated service-to-service communication
- Implemented containerized deployment
- Built Kubernetes production manifests
- Configured monitoring and alerting
- Built CI/CD with rollback
- Prepared professional project documentation

## Conclusion

This project demonstrates a complete cloud-native application lifecycle from development to production deployment. It is suitable for a college major project, placement resume, DevOps portfolio, and cloud computing demonstration.
