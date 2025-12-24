package ro.krumpi.demo.service;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id : " + id));
    }

    public Product getProductByName(String name) {
        return productRepository.findByName(name);
    }

    public boolean productExists(Long id) {
        return productRepository.existsById(id);
    }

    public boolean productExistsByName(String name) {
        return productRepository.existsByName(name);
    }

    public List<Product> getProductsByUsername(String username) {
        return productRepository.findAllByOwnerUsername(username);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = getProductById(id);

        existing.setName(updatedProduct.getName());
        existing.setType(updatedProduct.getType());
        existing.setUnitOfMeasure(updatedProduct.getUnitOfMeasure());
        existing.setQuantity(updatedProduct.getQuantity());

        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public void deleteAllProducts() {
        productRepository.deleteAll();
    }
}
