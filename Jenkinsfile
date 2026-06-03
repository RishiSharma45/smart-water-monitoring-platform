pipeline {
    agent any

    environment {
        REGISTRY = credentials('docker-registry-namespace')
        DOCKER_CREDENTIALS = 'docker-registry-credentials'
        KUBECONFIG_CREDENTIALS = 'kubeconfig'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
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
                bat 'docker build -t %REGISTRY%/smart-water-frontend:%IMAGE_TAG% frontend'
                bat 'docker build -t %REGISTRY%/smart-water-user-service:%IMAGE_TAG% services/user-service'
                bat 'docker build -t %REGISTRY%/smart-water-tank-service:%IMAGE_TAG% services/tank-service'
                bat 'docker build -t %REGISTRY%/smart-water-notification-service:%IMAGE_TAG% services/notification-service'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                    bat 'docker push %REGISTRY%/smart-water-frontend:%IMAGE_TAG%'
                    bat 'docker push %REGISTRY%/smart-water-user-service:%IMAGE_TAG%'
                    bat 'docker push %REGISTRY%/smart-water-tank-service:%IMAGE_TAG%'
                    bat 'docker push %REGISTRY%/smart-water-notification-service:%IMAGE_TAG%'
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
                    bat 'kubectl apply -f k8s/'
                    bat 'kubectl apply -f k8s/hpa/'
                    bat 'kubectl apply -f k8s/monitoring/'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/frontend frontend=%REGISTRY%/smart-water-frontend:%IMAGE_TAG%'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/user-service user-service=%REGISTRY%/smart-water-user-service:%IMAGE_TAG%'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/tank-service tank-service=%REGISTRY%/smart-water-tank-service:%IMAGE_TAG%'
                    bat 'kubectl -n %K8S_NAMESPACE% set image deployment/notification-service notification-service=%REGISTRY%/smart-water-notification-service:%IMAGE_TAG%'
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
                }
            }
        }

        stage('Rollback Preview') {
            steps {
                echo 'Rollback is automated in the post-failure section if deployment verification fails.'
            }
        }
    }

    post {
        success {
            echo "Smart Water Monitor deployed successfully with image tag ${IMAGE_TAG}"
        }

        failure {
            echo "Pipeline failed. Rollback stage attempted to restore previous Kubernetes deployments."
            withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/frontend || exit 0'
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/user-service || exit 0'
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/tank-service || exit 0'
                bat 'kubectl -n %K8S_NAMESPACE% rollout undo deployment/notification-service || exit 0'
            }
        }
    }
}
