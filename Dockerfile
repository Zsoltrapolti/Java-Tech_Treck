# frontend: Vite + React
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

# Copiem package.json pentru caching
COPY frontend/package*.json ./

# Instalăm dependințele
RUN npm install

# Copiem codul sursă frontend
COPY frontend/ ./

# Build-uim aplicația Vite
RUN npm run build



# backend: Spring Boot
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend

# Copiem pom.xml pentru caching
COPY backend/pom.xml ./

# Descărcăm dependințele Maven
RUN mvn dependency:go-offline

# Copiem codul sursă backend
COPY backend/src ./src

# Copiem frontend-ul build-uit în directorul static al Spring Boot
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

# Construim .jar-ul
RUN mvn clean package -DskipTests



# Imagine finală pentru rulare
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiem .jar-ul construit
COPY --from=backend-build /app/backend/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Expunem portul 8081
EXPOSE 8081

# Comanda de start
ENTRYPOINT ["java", "-jar", "app.jar"]
