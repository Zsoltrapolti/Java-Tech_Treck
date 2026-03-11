package ro.krumpi.demo.serviceTests;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.repository.ProductRepository;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.service.ProductService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Widget");
        product.setPrice(10.0);
        product.setQuantity(100.0);
        product.setUnitOfMeasure("pcs");
    }

    @Test
    @DisplayName("createProduct: Success")
    void createProduct_Success() {
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product saved = productService.createProduct(product);

        assertNotNull(saved);
        assertEquals("Widget", saved.getName());
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("getProductById: Should throw exception when not found")
    void getProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> productService.getProductById(1L));

        assertTrue(ex.getMessage().contains("Product not found"));
    }

    @Test
    @DisplayName("updateProduct: Should update existing fields and save")
    void updateProduct_Success() {
        // Arrange
        Product updatedData = new Product();
        updatedData.setName("Updated Widget");
        updatedData.setPrice(15.0);
        updatedData.setQuantity(50.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Product result = productService.updateProduct(1L, updatedData);

        // Assert
        assertEquals("Updated Widget", result.getName());
        assertEquals(15.0, result.getPrice());
        assertEquals(50.0, result.getQuantity());
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("deleteProduct: Should find then delete")
    void deleteProduct_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        productService.deleteProduct(1L);

        // Assert
        verify(productRepository).delete(product);
    }

    @Test
    @DisplayName("productExistsByName: Success")
    void productExistsByName_ReturnsTrue() {
        when(productRepository.existsByName("Widget")).thenReturn(true);

        boolean exists = productService.productExistsByName("Widget");

        assertTrue(exists);
        verify(productRepository).existsByName("Widget");
    }

    @Test
    @DisplayName("getAllProducts: Returns list")
    void getAllProducts_ReturnsList() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<Product> products = productService.getAllProducts();

        assertFalse(products.isEmpty());
        assertEquals(1, products.size());
    }
}