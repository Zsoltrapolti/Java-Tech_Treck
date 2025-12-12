package ro.krumpi.demo.serviceTests;

import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.repository.ProductRepository;
import ro.krumpi.demo.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void createProduct() {
        // Given
        Product product = new Product();
        product.setName("Test");
        product.setType("Type");
        product.setUnitOfMeasure("Unit");
        product.setQuantity(0.0); // Ensure quantity is initialized

        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setName("Test");
        savedProduct.setType("Type");
        savedProduct.setUnitOfMeasure("Unit");
        savedProduct.setQuantity(0.0);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // When
        Product result = productService.createProduct(product);

        // Then
        assertNotNull(result.getId());
        assertEquals("Test", result.getName());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void getAllProducts() {
        // Given: CORRECTED CONSTRUCTOR CALL (must include quantity as Double)
        Product p1 = new Product(1L, "Product1", "Type1", "Unit1", 1.0);
        Product p2 = new Product(2L, "Product2", "Type2", "Unit2", 5.0);
        List<Product> products = Arrays.asList(p1, p2);

        when(productRepository.findAll()).thenReturn(products);

        // When
        List<Product> result = productService.getAllProducts();

        System.out.println(result.getFirst().getId());
        // Then
        assertEquals(2, result.size());
        assertEquals(1L, result.getFirst().getId());
    }

    @Test
    void getProductById_found() {
        Product product = new Product(1L, "Test", "Type", "Unit", 10.0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // When
        Product result = productService.getProductById(1L);

        // Then
        assertEquals("Test", result.getName());
    }

    @Test
    void getProductById_notFound() {
        // Given
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> {
            productService.getProductById(99L);
        });
    }
}
