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
                    sh "mvn clean test"
                }
            }
        }

        stage('2. Analiza Calitate Cod (SonarQube)') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    dir('backend') {
                        echo "TRIMITEM CODUL LA SONARQUBE"
                           sh "mvn sonar:sonar -Dsonar.projectKey=Krumpi-Project-Shared -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=${SONAR_TOKEN}"
                        }
                    }

                timeout(time: 2, unit: 'MINUTES') {
                    script {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                           error "Pipeline oprit! Quality Gate a picat: ${qg.status}"
                        }
                    }
                }
            }
        }

        stage('3. Construire Imagine Docker') {
            steps {
                echo " TESTE TRECUTE! CONSTRUIM IMAGINEA "
                    sh "docker build -t krumpi-app:latest ."
            }
        }
    }
}
