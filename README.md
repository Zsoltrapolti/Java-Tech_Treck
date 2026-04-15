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

- Necesar Docker Desktop pornit
- Pornire din root-ul proiectului:

```bash

docker-compose -f docker-compose.yml up -d --build

```
- Accesare Jenkins:

```bash

http://localhost:8082

```
- Se ia parola initiala Jenkins (ruleaza in terminal): 

```bash

docker logs jenkins_krumpi
  
```

- Lipeste parola in browser pe pagina de login Jenkins pentru a debloca interfata.
- Selecteaza "Install Suggested Plugins" si asteapta finalizarea.
- In Jenkins: Manage Jenkins -> Tools -> Maven -> Add Maven (Name: Maven-Jenkins).
- In Jenkins: Manage Jenkins -> Plugins -> SonarQube Scanner for Jenkins -> Install
- In SonarQube: Administartion -> Webhooks -> Create ( URL: http://jenkins_krumpi:8080/sonarqube-webhook/, Name: Jenkins)
- In SonarQube: My Account -> Security -> Generate Token.
- In Jenkins: Manage Jenkins -> System -> Add SonarQube (URL: http://sonarqube:9000, Token: adauga-l ca Secret Text cu ID sonar-token).
- In Jenkins: New Item -> Pipeline -> Pipeline script from SCM -> Git -> Repository URL -> Branch: */main -> Script Path: Jenkinsfile.

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


## API Documentation
The application exposes a RESTful API, documented via OpenAPI/Swagger, which allows standardized interaction with the PostgreSQL database. The API is structured into several domain controllers for managing the Krumpi workflow:
1.Authentication & Account Management

    POST /api/auth/register: Registers a new user in the system.

    POST /api/auth/login: Authenticates the user.

    GET /api/auth/me: Returns the data of the currently logged-in user.

    POST /api/account-requests: Creates a request for a new account.

    GET /api/account-requests/status: Checks the status of an account request.

2.Products & Shopping Cart

    GET /api/products: Returns the list of all available stock.

    GET /api/products/{id}: Retrieves the details of a single product.

    POST /api/products: Adds a new product to the catalog.

    PUT /api/products/{id}: Modifies the details of an existing product.

    DELETE /api/products/{id}: Removes a product from the stock.

    POST /api/cart/items: Adds a product to the shopping cart.

    GET /api/cart: Returns the cart contents for the current user.

    DELETE /api/cart/items/{cartItemId}: Removes a product from the cart.

   3. Orders & Invoices

    GET /api/orders / POST /api/orders: Fetch all orders or create new ones.

    GET /api/orders/{id} / PUT /api/orders/{id} / DELETE /api/orders/{id}: CRUD operations for a specific order.

    POST /api/orders/{id}/confirm / deliver / cancel: Modifies the order status.

    POST /api/invoices/checkout: Places a final order from the cart (Checkout) by filling in delivery/card details.

    GET /api/invoices: Returns all orders/invoices for the current user.

    POST /api/invoices/{id}/send-email: Sends a specific invoice to the client's email.

4.Payments & History

    POST /api/payments: Processes a payment for an invoice.

    POST /api/payments/cancel/{invoiceId}: Cancels a payment.

    GET /api/history/orders / GET /api/history/payments: Retrieves transaction and order history.

5.HR & Leave Management

    GET /api/employees / POST /api/employees: Fetch and create new employees.

    POST /api/leave/request: Submits a new leave request.

    PUT /api/leave/{requestId}/approve / cancel: Approves or cancels a leave request.

    GET /api/leave/all: Returns all leave requests in the system.

6.Administration & Client Management

    GET /api/admin/accounts: Lists all accounts in the system.

    PUT /api/admin/accounts/{id}/role: Changes the role of an account (e.g., from User to Admin/Employee).

    PUT /api/admin/account-requests/{id}/review: Reviews and approves/rejects a new account request.

    GET /api/client-management/unassigned-clients: Finds clients that do not have an assigned Account Manager yet.

    POST /api/client-management/claim-client/{clientId}: Assigns a client to an employee.



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

