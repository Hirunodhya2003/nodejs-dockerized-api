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
    }

    post {
        success {
            echo 'Docker images built successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
