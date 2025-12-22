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
- React: 19.2.0
- TypeScript: 5.9.3
- Vite: 7.2.6
- Material UI: 7.3.6
- Node.js: 20+

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

### Flyway (DB migrations)
Location: `NTT_TechTrek/`

Config file (already in repo):`flyway.conf`

Common commands (from `NTT_TechTrek/`):
```bash
# run migration on DB from flyway.conf
./mvnw clean flyway:migrate -Dflyway.configFiles=flyway.conf

# status
./mvnw flyway:info -Dflyway.configFiles=flyway.conf

# repair+migrate for any modification 
./mvnw flyway:repair -Dflyway.configFiles=flyway.conf
./mvnw flyway:migrate -Dflyway.configFiles=flyway.conf
```
!!!! REMEMBER !!! :
- don't edit applied Vx migrations , better create a new file `V{n}__description.sql` in `src/main/resources/db/migration`.
- `spring.jpa.hibernate.ddl-auto=validate` – must come from migrations, not Hibarnate ...

## Frontend 

Location: `frontend/`

Commands:

```bash
cd frontend

# Install dependencies
npm install

# Run the application
npm run dev
```

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

## 📌 Trello Board

We are using Trello to manage tasks, track progress, and organize the project workflow.

Access the board here:  
https://trello.com/b/fDtMqXC2/krumpi


## Hints for backend issues

If you have problems with DB : 
    1. Let me know
    2. Use these commands :
    ```bash
        dropdb -h localhost -p 5436 -U postgres krumpi_db
        createdb -h localhost -p 5436 -U postgres krumpi_db
        ./mvnw spring-boot:run 
    ```bash
    Now, everything has to be fine !  Heart eyes

## Methods in BACKEND
<img width="620" height="212" alt="image" src="https://github.com/user-attachments/assets/6930d8df-37da-4f75-92f7-55e4c2793f2b" /> 


/register endpoint is working !!!
You can test it in POSTAMAN , I updated our collection . 
