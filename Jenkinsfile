pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        K8S_NAMESPACE = 'smart-water'
        FRONTEND_IMAGE = 'smart-water-monitor-frontend:latest'
        USER_IMAGE = 'smart-water-monitor-user-service:latest'
        TANK_IMAGE = 'smart-water-monitor-tank-service:latest'
        NOTIFICATION_IMAGE = 'smart-water-monitor-notification-service:latest'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
                bat 'git rev-parse --short HEAD'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                }
                dir('services/user-service') {
                    bat 'npm ci'
                }
                dir('services/tank-service') {
                    bat 'npm ci'
                }
                dir('services/notification-service') {
                    bat 'npm ci'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Validate Services') {
            steps {
                dir('services/user-service') {
                    bat 'node --check src/app.js'
                }
                dir('services/tank-service') {
                    bat 'node --check src/app.js'
                }
                dir('services/notification-service') {
                    bat 'node --check src/app.js'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker version'
                bat 'docker build --load -t %FRONTEND_IMAGE% frontend'
                bat 'docker build --load -t %USER_IMAGE% services/user-service'
                bat 'docker build --load -t %TANK_IMAGE% services/tank-service'
                bat 'docker build --load -t %NOTIFICATION_IMAGE% services/notification-service'
                bat 'docker images | findstr smart-water-monitor'
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                bat 'kubectl version --client'
                bat 'kubectl config current-context'
                bat 'kubectl apply -f k8s/namespace.yaml'
                bat 'kubectl apply -f k8s/configmap.yaml'
                bat 'kubectl apply -f k8s/secret.yaml'
                bat 'kubectl apply -f k8s/postgres-init-configmap.yaml'
                bat 'kubectl apply -f k8s/postgres-pvc.yaml'
                bat 'kubectl apply -f k8s/postgres-deployment.yaml'
                bat 'kubectl apply -f k8s/postgres-service.yaml'
                bat 'kubectl apply -f k8s/user-deployment.yaml'
                bat 'kubectl apply -f k8s/user-service.yaml'
                bat 'kubectl apply -f k8s/tank-deployment.yaml'
                bat 'kubectl apply -f k8s/tank-service.yaml'
                bat 'kubectl apply -f k8s/notification-deployment.yaml'
                bat 'kubectl apply -f k8s/notification-service.yaml'
                bat 'kubectl apply -f k8s/frontend-deployment.yaml'
                bat 'kubectl apply -f k8s/frontend-service.yaml'
                bat 'kubectl apply -f k8s/ingress.yaml'
                bat 'kubectl -n %K8S_NAMESPACE% rollout restart deployment/frontend'
                bat 'kubectl -n %K8S_NAMESPACE% rollout restart deployment/user-service'
                bat 'kubectl -n %K8S_NAMESPACE% rollout restart deployment/tank-service'
                bat 'kubectl -n %K8S_NAMESPACE% rollout restart deployment/notification-service'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking deployment rollout status...'
                bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/postgres --timeout=180s'
                bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/frontend --timeout=180s'
                bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/user-service --timeout=180s'
                bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/tank-service --timeout=180s'
                bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/notification-service --timeout=180s'
                echo 'Rollout completed. Current Kubernetes status:'
                bat 'kubectl -n %K8S_NAMESPACE% get deployments'
                bat 'kubectl -n %K8S_NAMESPACE% get pods -o wide'
                bat 'kubectl -n %K8S_NAMESPACE% get services'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Smart Water Monitoring Platform built and deployed to local Kubernetes.'
        }
        failure {
            echo 'FAILED: Check the stage output above. Common causes are Docker Desktop not running, Kubernetes disabled, or missing Node.js/Docker/kubectl in Jenkins PATH.'
        }
    }
}
