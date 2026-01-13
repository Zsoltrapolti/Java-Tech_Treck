package ro.krumpi.demo.controller;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import ro.krumpi.demo.dto.ProductDTO;
import ro.krumpi.demo.mapper.ProductMapper;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5174")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @Operation(
            summary = "Create product",
            description = "Adds a new product to the catalog"
    )
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productdto, Principal principal) {
        Product product = ProductMapper.toEntity(productdto);
        Product saved = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProductMapper.toDTO(saved));
    }

    @Operation(
            summary = "Get all products",
            description = "Returns a list of all products"
    )
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts()
                .stream()
                .map(ProductMapper::toDTO)
                .toList();
    }

    @Operation(
            summary = "Get all my products",
            description = "Returns a list of all the products I added"
    )
    @GetMapping("/my")
    public List<ProductDTO> getMyProducts(Principal principal) {
        return productService.getProductsByUsername(principal.getName())
                .stream()
                .map(ProductMapper::toDTO)
                .toList();
    }

    @Operation(
            summary = "Get product by ID",
            description = "Returns details of a specific product"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ProductMapper.toDTO(product));
    }

    @Operation(
            summary = "Update product",
            description = "Modifies product details or assigns an owner"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {

        Product existingProduct = productService.getProductById(id);

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


    @Operation(
            summary = "Unclaim product",
            description = "Removes the product from the logged-in user's personal list"
    )
    @PutMapping("/{id}/unclaim")
    public ResponseEntity<Void> unclaimProduct(@PathVariable Long id, Principal principal) {
        productService.removeProductFromUserSelection(id, principal.getName());

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Claim a product",
            description = "Adds a new product to the user"
    )
    @PutMapping("/{id}/claim")
    public ResponseEntity<Void> claimProduct(@PathVariable Long id, Principal principal) {
        productService.addProductToUserSelection(id, principal.getName());
        return ResponseEntity.ok().build();
    }
}