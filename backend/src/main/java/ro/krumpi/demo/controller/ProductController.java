package ro.krumpi.demo.controller;
import jakarta.validation.Valid;
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
        product.setOwnerUsername(principal.getName());
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
            description = "Modifies product details for the given ID"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO dto )
    {
        Product updated = productService.updateProduct(id, ProductMapper.toEntity(dto));
        return ResponseEntity.ok(ProductMapper.toDTO(updated));
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