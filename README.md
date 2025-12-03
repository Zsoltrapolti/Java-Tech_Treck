# Java-Tech_Treck

# Krumpi Management System

Monolithic Spring Boot application for:
- raw material stock management
- employee management
- order management

---

## Project Purpose

This project wants to digitalize the internal workflows of the company *Krumpi, starting with:
1. Stock management of raw materials
2. Employee management
3. Order management
   
---

## Technologies Used

- Java
- Spring Boot
- PostgreSQL
- Maven

---

## Backend 
Location: `NTT_TechTrek/`

Commands:

```bash
cd NTT_TechTrek

# Build the project
mvn clean install

# Run the backend
mvn spring-boot:run
```
Backend runs on port:
http://localhost:8081

## Frontend 

## Data Base

```bash
# Connect as postgres user
psql -U postgres

# Show databases
 \l

# Acces DataBase 
\c krumpi_db
You are now connected to database "krumpi_db" as user "postgres". (you have to see this msg)

# Exit psql
\q
```
**<img width="309" height="224" alt="image" src="https://github.com/user-attachments/assets/9ba93b83-3e66-4e5f-8744-9ffd01a1f776" />

