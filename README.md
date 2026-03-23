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



## Docker



- pornim aplicatia Docker Desktop si ne asiguram ca ruleaza

- deschidem terminalul, ne ducem in folderul proiectului si rulam:

```bash

  docker-compose up --build

```

- aplicatia este activa la:

```bash

  (http://localhost:8081)

```

- daca vrem sa oprim docker folosim CTRL C sau

```bash

  docker-compose down

```


---


## Jenkins

- necesar Docker Desktop pornit
- accesam Jenkins la:

```bash

  http://localhost:8080

```
- mergem la Manage Jenkins -> Tools -> Add Maven. Pune numele Maven-Jenkins și bifează Install automatically. (doar prima data cand rulam)

- creem proiect New Item -> Nume proiect -> Pipeline. La Definition: selectează Pipeline script from SCM. La SCM: selectează Git și pune link-ul proiectului. Save.

- Build Now în meniul proiectului.

- pastram fail("Am stricat testul intentionat pentru Jenkins"); din clasa de testare DemoApplicationTests pentru a vedea cum se comporta Jenkins la un build failed.

- daca vrem sa vedem logurile din Jenkins, mergem la proiectul nostru -> Build History -> build-ul curent -> Console Output. Aici putem vedea toate logurile generate de build, inclusiv erorile care au cauzat fail-ul testului.

- comentam linia cu fail din DemoApplicationTests pentru a vedea cum se comporta Jenkins la un build successful.
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





# SpiceGarden



SpiceGarden is a Spring Boot microservice for managing a catalog of spices, orders, customers, and prices.

The project includes:

- REST API for CRUD operations on spices, categories, customers, and orders

- SOAP integration for prices

- Persistence with PostgreSQL

- OpenAPI (Swagger) documentation



## Running the JAR

1. Make sure you have Java 21 installed.

2. The JAR file is already present on the `main` branch at `backend/target/backend-0.0.1-SNAPSHOT.jar`.Open a terminal to bring .jar from main branch:

	```bash

	git checkout main

	git pull

	```



3. Make sure PostgreSQL is running and the settings in `application.properties` are correct.

4. Run the JAR in the terminal:

	```bash

	java -jar backend/target/backend-0.0.1-SNAPSHOT.jar

	```

5. Access the API at `http://localhost:8099`





## API Documentation

After starting the application, OpenAPI/Swagger documentation is available at:

```

http://localhost:8099/swagger-ui.html

```



## Contact

For questions/issues, contact me 



---



## Configurare pe fiecare  (local)



### Cerinte

1. PostgreSQL pornit pe `localhost:5436`

2. User DB: `postgres`

3. Parola DB: `root`

4. Din root proiect:

```bash

cd Java-Tech_Treck

```



### Setup initial (o singura data)

1. Instaleaza dependintele frontend:

```bash

cd frontend

npm install

cd ..

```

2. Curata build backend:

```bash

cd backend

./mvnw clean

cd ..

```



# Zsolt



## Backend

1. Creeaza baza locala:

```bash

cd backend

PGPASSWORD=root createdb -h localhost -p 5436 -U postgres krumpi_zsolt_db 2>/dev/null || true

```

2. Porneste backend cu configurarea lui:

```bash

./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.config.name=application,app_zsolt"

```

3. Creeaza/actualizeaza user admin:

```bash

ADMIN_HASH='$2a$10$3SwEfchO6yuvfnD1Ehnhx./hJCL.ox1aG9xHxOaYBE4S2k.HWOyHe'

PGPASSWORD=root psql -h localhost -p 5436 -U postgres -d krumpi_zsolt_db -c "INSERT INTO users (username, password, role) VALUES ('zsolt@krumpi.ro', '$ADMIN_HASH', 'ADMIN') ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, role = 'ADMIN';"

```



## Frontend

1. In `frontend/src/api/backend.ts` seteaza local:

```ts

const BACKEND_URL = "http://localhost:8082/api";

```

2. Ruleaza frontend:

```bash

cd ../frontend

npm run dev

```



## Login

- Username: `zsolt@krumpi.ro`

- Password: `Admin123!`



# Catalina



## Backend

1. Creeaza baza locala:

```bash

cd backend

PGPASSWORD=root createdb -h localhost -p 5436 -U postgres krumpi_catalina_db 2>/dev/null || true

```

2. Porneste backend cu configurarea ei:

```bash

./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.config.name=application,app_catalina"

```

3. Creeaza/actualizeaza user admin:

```bash

ADMIN_HASH='$2a$10$3SwEfchO6yuvfnD1Ehnhx./hJCL.ox1aG9xHxOaYBE4S2k.HWOyHe'

PGPASSWORD=root psql -h localhost -p 5436 -U postgres -d krumpi_catalina_db -c "INSERT INTO users (username, password, role) VALUES ('catalina@krumpi.ro', '$ADMIN_HASH', 'ADMIN') ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, role = 'ADMIN';"

```



## Frontend

1. In `frontend/src/api/backend.ts` seteaza local:

```ts

const BACKEND_URL = "http://localhost:8083/api";

```

2. Ruleaza frontend:

```bash

cd ../frontend

npm run dev

```



## Login

- Username: `catalina@krumpi.ro`

- Password: `Admin123!`



# Andreea



## Backend

1. Creeaza baza locala:

```bash

cd backend

PGPASSWORD=root createdb -h localhost -p 5436 -U postgres krumpi_andreea_db 2>/dev/null || true

```

2. Porneste backend cu configurarea ei:

```bash

./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.config.name=application,app_andreea"

```

3. Creeaza/actualizeaza user admin:

```bash

ADMIN_HASH='$2a$10$3SwEfchO6yuvfnD1Ehnhx./hJCL.ox1aG9xHxOaYBE4S2k.HWOyHe'

PGPASSWORD=root psql -h localhost -p 5436 -U postgres -d krumpi_andreea_db -c "INSERT INTO users (username, password, role) VALUES ('andreea@krumpi.ro', '$ADMIN_HASH', 'ADMIN') ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, role = 'ADMIN';"

```



## Frontend

1. In `frontend/src/api/backend.ts` seteaza local:

```ts

const BACKEND_URL = "http://localhost:8084/api";

```

2. Ruleaza frontend:

```bash

cd ../frontend

npm run dev

```



## Login

- Username: `andreea@krumpi.ro`

- Password: `Admin123!`

