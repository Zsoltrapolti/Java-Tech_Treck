package com.example.demo.contollerTests;

import com.example.demo.model.stock.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void cleanup() {
        // Optional: Clean database before each test
    }

    @Test
    void createProduct_shouldReturnCreatedProduct() throws Exception {
        // Given
        Product product = new Product();
        product.setName("Integration Test Product");
        product.setType("Test");
        product.setUnitOfMeasure("Unit");

        // When
        ResultActions response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product)));

        // Then
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Integration Test Product")))
                .andExpect(jsonPath("$.type", is("Test")))
                .andExpect(jsonPath("$.unitOfMeasure", is("Unit")))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void getAllProducts_shouldReturnEmptyList() throws Exception {
        // When
        ResultActions response = mockMvc.perform(get("/api/products"));

        // Then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(0)));
    }

    @Test
    void getProductById_whenProductExists() throws Exception {
        // First create a product
        Product product = new Product();
        product.setName("Test Get");
        product.setType("Type");
        product.setUnitOfMeasure("Unit");

        String createResponse = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Product createdProduct = objectMapper.readValue(createResponse, Product.class);
        Long productId = createdProduct.getId();

        // Then get it by ID
        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(productId.intValue())))
                .andExpect(jsonPath("$.name", is("Test Get")));
    }

    @Test
    void updateProduct_shouldUpdateSuccessfully() throws Exception {
        // Create product
        Product product = new Product();
        product.setName("Original");
        product.setType("Type");
        product.setUnitOfMeasure("Unit");

        String createResponse = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Product createdProduct = objectMapper.readValue(createResponse, Product.class);
        Long productId = createdProduct.getId();

        // Update product
        Product updateData = new Product();
        updateData.setName("Updated Name");
        updateData.setType("Updated Type");
        updateData.setUnitOfMeasure("Updated Unit");

        mockMvc.perform(put("/api/products/{id}", productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")))
                .andExpect(jsonPath("$.type", is("Updated Type")));
    }

    @Test
    void deleteProduct_shouldDeleteSuccessfully() throws Exception {
        // Create product
        Product product = new Product();
        product.setName("To Delete");
        product.setType("Type");
        product.setUnitOfMeasure("Unit");

        String createResponse = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Product createdProduct = objectMapper.readValue(createResponse, Product.class);
        Long productId = createdProduct.getId();

        // Delete product
        mockMvc.perform(delete("/api/products/{id}", productId))
                .andExpect(status().isNoContent());

        // Verify it's deleted
        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isNotFound());
    }
}