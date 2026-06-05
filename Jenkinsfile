pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        K8S_NAMESPACE = 'smart-water'
        FRONTEND_REPOSITORY = 'smart-water-monitor-frontend'
        USER_REPOSITORY = 'smart-water-monitor-user-service'
        TANK_REPOSITORY = 'smart-water-monitor-tank-service'
        NOTIFICATION_REPOSITORY = 'smart-water-monitor-notification-service'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                bat 'git rev-parse --short HEAD'
                script {
                    env.FRONTEND_IMAGE = "${env.FRONTEND_REPOSITORY}:${env.BUILD_NUMBER}"
                    env.USER_IMAGE = "${env.USER_REPOSITORY}:${env.BUILD_NUMBER}"
                    env.TANK_IMAGE = "${env.TANK_REPOSITORY}:${env.BUILD_NUMBER}"
                    env.NOTIFICATION_IMAGE = "${env.NOTIFICATION_REPOSITORY}:${env.BUILD_NUMBER}"
                }
                echo "Docker image tag for this deployment: ${env.BUILD_NUMBER}"
            }
        }

        stage('Build') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
                bat 'docker version'
                bat 'docker build --load -t %FRONTEND_IMAGE% frontend'
                bat 'docker build --load -t %USER_IMAGE% services/user-service'
                bat 'docker build --load -t %TANK_IMAGE% services/tank-service'
                bat 'docker build --load -t %NOTIFICATION_IMAGE% services/notification-service'
                bat 'docker images | findstr smart-water-monitor'
            }
        }

        stage('Deploy') {
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
                bat 'kubectl -n %K8S_NAMESPACE% set image deployment/frontend frontend=%FRONTEND_IMAGE%'
                bat 'kubectl -n %K8S_NAMESPACE% set image deployment/user-service user-service=%USER_IMAGE%'
                bat 'kubectl -n %K8S_NAMESPACE% set image deployment/tank-service tank-service=%TANK_IMAGE%'
                bat 'kubectl -n %K8S_NAMESPACE% set image deployment/notification-service notification-service=%NOTIFICATION_IMAGE%'
            }
        }

        stage('Verify') {
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
                bat 'kubectl -n %K8S_NAMESPACE% get deployment frontend user-service tank-service notification-service -o custom-columns=NAME:.metadata.name,IMAGE:.spec.template.spec.containers[0].image'
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
