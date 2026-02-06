package ro.krumpi.demo.serviceTests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.repository.ProductRepository;
import ro.krumpi.demo.service.ProductService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void testGetProductById_Success() {
        // Arrange
        Product p = new Product();
        p.setId(1L);
        p.setName("Krumpli");
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        // Act
        Product result = productService.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Krumpli", result.getName());
    }

    @Test
    void testProductExists_True() {
        when(productRepository.existsById(1L)).thenReturn(true);
        assertTrue(productService.productExists(1L));
    }
}