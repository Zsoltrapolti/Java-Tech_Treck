package ro.krumpi.demo.controller;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    @Operation(
            summary = "Create product",
            description = "Adds a new product to the catalog"
    )
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        product.setId(null);
        Product savedProduct = productService.createProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Get all products",
            description = "Returns a list of all products"
    )
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Product>> getMyProducts(java.security.Principal principal) {

        List<Product> myProducts = productService.getProductsByUsername(principal.getName());
        return ResponseEntity.ok(myProducts);
    }

    @Operation(
            summary = "Get product by ID",
            description = "Returns details of a specific product"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @Operation(
            summary = "Update product",
            description = "Modifies product details or assigns an owner"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {

        Product existingProduct = productService.getProductById(id);
        existingProduct.setOwnerUsername(productDetails.getOwnerUsername());

        Product updated = productService.updateProduct(id, existingProduct);
        return ResponseEntity.ok(updated);
    }

    @Operation(
            summary = "Delete product",
            description = "Removes the product with the given ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/test")
    public String test() {
        return "Product API is working! Time: " + new java.util.Date();
    }


}