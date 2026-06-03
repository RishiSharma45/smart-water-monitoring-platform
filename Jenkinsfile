pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_NAMESPACE = credentials('docker-registry-namespace')
        DOCKER_CREDENTIALS = 'docker-registry-credentials'
        KUBECONFIG_CREDENTIALS = 'kubeconfig'
        K8S_NAMESPACE = 'smart-water'
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
            }
        }

        stage('Initialize Build Metadata') {
            steps {
                script {
                    env.GIT_COMMIT_SHORT = bat(
                        script: '@git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                    env.FRONTEND_IMAGE = "${env.DOCKER_HUB_NAMESPACE}/smart-water-frontend:${env.IMAGE_TAG}"
                    env.USER_IMAGE = "${env.DOCKER_HUB_NAMESPACE}/smart-water-user-service:${env.IMAGE_TAG}"
                    env.TANK_IMAGE = "${env.DOCKER_HUB_NAMESPACE}/smart-water-tank-service:${env.IMAGE_TAG}"
                    env.NOTIFICATION_IMAGE = "${env.DOCKER_HUB_NAMESPACE}/smart-water-notification-service:${env.IMAGE_TAG}"
                }
                echo "Building Smart Water Monitor image tag ${IMAGE_TAG}"
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            bat 'npm ci'
                        }
                    }
                }

                stage('User Service') {
                    steps {
                        dir('services/user-service') {
                            bat 'npm ci'
                        }
                    }
                }

                stage('Tank Service') {
                    steps {
                        dir('services/tank-service') {
                            bat 'npm ci'
                        }
                    }
                }

                stage('Notification Service') {
                    steps {
                        dir('services/notification-service') {
                            bat 'npm ci'
                        }
                    }
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

        stage('Validate Backend Syntax') {
            parallel {
                stage('User Syntax') {
                    steps {
                        dir('services/user-service') {
                            bat 'node --check src/app.js'
                        }
                    }
                }

                stage('Tank Syntax') {
                    steps {
                        dir('services/tank-service') {
                            bat 'node --check src/app.js'
                        }
                    }
                }

                stage('Notification Syntax') {
                    steps {
                        dir('services/notification-service') {
                            bat 'node --check src/app.js'
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %FRONTEND_IMAGE% frontend'
                bat 'docker build -t %USER_IMAGE% services/user-service'
                bat 'docker build -t %TANK_IMAGE% services/tank-service'
                bat 'docker build -t %NOTIFICATION_IMAGE% services/notification-service'
            }
        }

        stage('Docker Hub Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                    bat 'docker push %FRONTEND_IMAGE%'
                    bat 'docker push %USER_IMAGE%'
                    bat 'docker push %TANK_IMAGE%'
                    bat 'docker push %NOTIFICATION_IMAGE%'
                }
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
                    bat 'kubectl apply -f k8s/namespace.yaml'
                    bat 'kubectl apply -f k8s/configmap.yaml'
                    bat 'kubectl apply -f k8s/secret.yaml'
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
                    bat 'kubectl apply -f k8s/hpa/'
                    bat 'kubectl apply -f k8s/monitoring/'
                    bat 'kubectl apply -f k8s/logging/'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/frontend frontend=%FRONTEND_IMAGE%'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/user-service user-service=%USER_IMAGE%'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/tank-service tank-service=%TANK_IMAGE%'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/notification-service notification-service=%NOTIFICATION_IMAGE%'
                }
            }
        }

        stage('Verify Rollout') {
            steps {
                withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
                    bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/frontend --timeout=120s'
                    bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/user-service --timeout=120s'
                    bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/tank-service --timeout=120s'
                    bat 'kubectl -n %K8S_NAMESPACE% rollout status deployment/notification-service --timeout=120s'
                    bat 'kubectl -n %K8S_NAMESPACE% get pods'
                }
            }
        }

        
    }

    post {
        failure {
            echo 'Pipeline failed. Attempting Kubernetes rollback.'
            withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/frontend || exit 0'
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/user-service || exit 0'
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/tank-service || exit 0'
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/notification-service || exit 0'
            }
           
        }

        success {
            echo "Smart Water Monitor deployed successfully with image tag ${IMAGE_TAG}"
        }
    }
}
