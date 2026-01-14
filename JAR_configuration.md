# SpiceGarden Backend – instructiuni pentru colegii care primesc doar jar-ul

Salut! 
Daca primesti `backend-0.0.1-SNAPSHOT.jar` si vrei sa-l integrezi in Krumpi, ti-am pregatit pasii simpli ca sa mearga totul:

## 1. Ce aveti 
- `backend-0.0.1-SNAPSHOT.jar` ()
- `application-properties`
- `SpiceGarden.postman_collection.json` pentru testare REST in Postman 

## 2. Setarea configurarii
1. Puneti jar-ul intr-un folder. 
2. Sa aveti si application.properties
3. Sa aveti si .csv urile (din .jar la src/main/resources) ... aici in mod normal ar trebui sa le citeasca din interiorul
jar ului

## 3. Configurarea bazei de date
1. Instalati sau porniti PostgreSQL si creati o baza dedicata:
   ```sql
   CREATE DATABASE spicegarden;
   CREATE USER spicegarden WITH PASSWORD 'schimbati_parola';
   GRANT ALL PRIVILEGES ON DATABASE spicegarden TO spicegarden;
   ```
2. In `application.properties` setati:
   ```
   spring.datasource.url=jdbc:postgresql://<host>:<port>/spicegarden
   spring.datasource.username=spicegarden
   spring.datasource.password=schimbati_parola
   spring.jpa.hibernate.ddl-auto=update
   ```
## 3. Cum pornesti aplicatia
1. Executa comanda:
   ```
   java -jar backend-0.0.1-SNAPSHOT.jar
   ```
2. Vezi in logs “Catalog loaded: X items” si “Connected to PostgreSQL” – daca apar, e gata 


## 4. Autentificare si JWT (aici va pun un video din postman)
1. Trimite POST la `/auth/login` cu JSON-ul:
   ```
   {"username": "krumpi", "password": "parola123"}
   ```
2. Primesti inapoi `{"token": "..."}`. Salveaza tokenul.
3. Pentru REST folosesti header:
   ```
   Authorization: Bearer <token>
   ```
4. Tokenul expira dupa 5 minute, deci daca apare 401/403, doar refaceti login sa va genereze unul nou.
5. Credentialele ce le folositi exista intr o baza de date 

## 5. Ce endpoints sunt (le regasiti si in Postman)
- `/spices` – listat, creare, update, delete condimente
- `/categories`, `/customers`, `/supply-orders`, `/orders`, `/order-items` – gasesti detalii in controller-ele din cod
- Swagger: `http://<host>:<port>/swagger-ui/index.html`
- Foloseste Postman ca in video 

## 6. SOAP (opțional)
- `http://<host>:<port>/ws/prices.wsdl` scoate preturile actuale (GetPricesRequest/Response)
- `http://<host>:<port>/ws/catalog.wsdl` pentru catalog + `ReloadCatalogRequest`
- Daca modifici `catalog.csv` in afara jar-ului, trimite `ReloadCatalogRequest` ca sa fie citit din nou sau reporneste jar-ul

## 7. Ce faci cand ceva nu merge
- daca primesti `jdbc` error: verifica credentialele din `application.properties` si asigura-te ca PostgreSQL e pornit
- daca primesti `403`: verifici headerul `Authorization`
- daca tokenul expira: retrimite `/auth/login`
- daca catalogul e gol: ruleaza SOAP-ul `ReloadCatalog` sau reporneste jar-ul

### INDIFERENT DE PROBLEMA, VA ROG SA MI SPUNETI! NU CONTEAZA CA NU E INTRE 15-17 , DOAR LASATI UN MESAJ! 😊✌🏻
