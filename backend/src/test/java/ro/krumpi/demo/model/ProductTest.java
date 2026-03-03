package ro.krumpi.demo.model;



import org.junit.jupiter.api.Test;
import ro.krumpi.demo.model.stock.Product;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void testProductSettersAndGetters() {
        // Arrange
        Product product = new Product();

        // Act
        product.setId(1L);
        product.setName("Alma");
        product.setType("Gyümölcs");
        product.setUnitOfMeasure("kg");
        product.setQuantity(10.0);
        product.setPrice(500.0);

        // Assert
        assertEquals(1L, product.getId());
        assertEquals("Alma", product.getName());
        assertEquals("Gyümölcs", product.getType());
        assertEquals("kg", product.getUnitOfMeasure());
        assertEquals(10.0, product.getQuantity());
        assertEquals(500.0, product.getPrice());
    }

    @Test
    void testFullConstructor() {
        // A manuálisan írt konstruktorod tesztelése
        Product product = new Product(2L, "Krumpli", "Zöldség", "db", 50.0, 120.0);

        assertAll("Product properties",
                () -> assertEquals(2L, product.getId()),
                () -> assertEquals("Krumpli", product.getName()),
                () -> assertEquals("Zöldség", product.getType()),
                () -> assertEquals("db", product.getUnitOfMeasure()),
                () -> assertEquals(50.0, product.getQuantity()),
                () -> assertEquals(120.0, product.getPrice())
        );
    }

    @Test
    void testNoArgsConstructor() {
        Product product = new Product();
        assertNotNull(product);
    }
}