pipeline {
    agent any
    tools {
            maven 'Maven-Jenkins'
        }
    stages {
        stage('1. Testare Backend (Java)') {
            steps {
                dir('backend') {
                    echo " PORNIM TESTELE JAVA "
                    mvn clean test
                }
            }
        }

        stage('2. Analiza Calitate Cod (SonarQube)') {
            withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
            dir('backend') {
                echo "TRIMITEM CODUL LA SONARQUBE "
                bat "mvn sonar:sonar " +
                    "-Dsonar.projectKey=Krumpi-Project-Shared " +
                    "-Dsonar.host.url=http://localhost:9000 " +
                    "-Dsonar.login=${SONAR_TOKEN}"
            }
        }

        stage('3. Construire Imagine Docker') {
            steps {
                echo " TESTE TRECUTE! CONSTRUIM IMAGINEA "
                docker build -t krumpi-app:latest .
            }
        }
    }
}