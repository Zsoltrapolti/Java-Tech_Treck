package com.example.demo.service;
import com.example.demo.model.stock.Product;
import com.example.demo.repository.ProductRepository;
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

    public Product createProduct(String name, String type, String unitOfMeasure, Double quantity) {
        Product product = new Product();
        product.setName(name);
        product.setType(type);
        product.setUnitOfMeasure(unitOfMeasure);
        product.setQuantity(quantity);
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

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getType() != null) {
            product.setType(productDetails.getType());
        }
        if (productDetails.getUnitOfMeasure() != null) {
            product.setUnitOfMeasure(productDetails.getUnitOfMeasure());
        }
        if (productDetails.getQuantity() != null) {
            product.setQuantity(productDetails.getQuantity());
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, String name, String type, String unitOfMeasure, Double quantity) {
        Product product = getProductById(id);
        if (name != null) product.setName(name);
        if (type != null) product.setType(type);
        if (unitOfMeasure != null) product.setUnitOfMeasure(unitOfMeasure);
        if (quantity != null) product.setQuantity(quantity);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public void deleteAllProducts() {
        productRepository.deleteAll();
    }
}
