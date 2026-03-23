pipeline {
    agent any
    tools {
            maven 'Maven-Jenkins'
        }
    stages {
        stage('1. Testare Backend (Java)') {
            steps {
                dir('backend') {
                    echo "PORNIM TESTELE PENTRU BACKEND"
                    bat 'mvn clean test'
                }
            }
        }

        stage('2. Construire Imagine Docker') {
            steps {
                echo "TESTELE AU TRECUT CU SUCCES, CONSTRUIM IMAGINEA DOCKER"
                bat 'docker build -t krumpi-app:latest .'
            }
        }
    }
}