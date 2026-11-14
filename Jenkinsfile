pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out Node.js project'
                checkout scm
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t nodejs-api-backend:${BUILD_NUMBER} .'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t nodejs-api-frontend:${BUILD_NUMBER} ./frontend'
            }
        }

        stage('Deploy Application') {
            steps {
                withCredentials([
                    string(credentialsId: 'task-db-password', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'task-jwt-secret', variable: 'JWT_SECRET')
                ]) {
                    sh '''
                        BACKEND_IMAGE=nodejs-api-backend:${BUILD_NUMBER} \
                        FRONTEND_IMAGE=nodejs-api-frontend:${BUILD_NUMBER} \
                        docker compose -p nodejs-dockerized-api \
                        -f "$WORKSPACE/docker-compose.yml" \
                        up -d --no-deps backend frontend
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Docker images built and deployed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
