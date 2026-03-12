package lab;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Random;

public class Main {
    public static void main(String[] args) throws Exception {
        Thread.sleep(10000);

        String url = "jdbc:postgresql://db:5432/testdocker";

        try (Connection conn = DriverManager.getConnection(url, "postgres", "catalina");
             Statement stmt = conn.createStatement()) {

            stmt.execute("CREATE TABLE IF NOT EXISTS tranzactii (id INT PRIMARY KEY, suma INT)");

            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) AS total FROM tranzactii");
            rs.next();
            int count = rs.getInt("total");

            if (count == 0) {
                System.out.println("Baza de date goala");
                Random rand = new Random();
                for (int i = 1; i <= 4; i++) {
                    stmt.execute("INSERT INTO tranzactii (id, suma) VALUES (" + i + ", " + rand.nextInt(1000) + ")");
                }
            } else {
                System.out.println("Exista " + count + " intrari.");
            }

            System.out.println("Datele din baza de date:");
            ResultSet data = stmt.executeQuery("SELECT * FROM tranzactii");
            while (data.next()) {
                System.out.println("ID: " + data.getInt("id") + " | Suma: " + data.getInt("suma"));
            }
        }
    }
}