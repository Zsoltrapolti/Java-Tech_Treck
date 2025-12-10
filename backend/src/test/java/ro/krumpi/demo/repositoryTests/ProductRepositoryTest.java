package com.example.demo.repositoryTests; // FIX PACKAGE FIRST!

import com.example.demo.model.stock.Product;
import com.example.demo.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=true"
})
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Test
    void saveProduct() {
        Product product = new Product();
        product.setName("Test");
        product.setType("Type");
        product.setQuantity(1.2);
        product.setUnitOfMeasure("Unit");

        Product saved = productRepository.save(product);

        assertNotNull(saved.getId());
        assertEquals("Test", saved.getName());
    }
}