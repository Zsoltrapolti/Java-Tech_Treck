package com.example.demo.contollerTests;

import com.example.demo.config.TestSecurityConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        // 1. Force H2 in-memory URL and driver
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",

        // 2. Disable Flyway/Liquibase to prevent interference and checksum errors
        "spring.flyway.enabled=false",
        "spring.liquibase.enabled=false", // Add this if Liquibase is a dependency

        // 3. Force Hibernate to build the schema from entities for the test run
        "spring.jpa.hibernate.ddl-auto=create-drop",

        // 4. Exclude Security auto-config
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
})
@AutoConfigureMockMvc
// REMOVE @ActiveProfiles("test") and @TestPropertySource annotations entirely
// to avoid conflicts with properties defined directly in @SpringBootTest(properties=...)
@Import(TestSecurityConfig.class)
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createProduct_shouldReturnCreatedProduct() throws Exception {
        // CORRECTED JSON: Removed quotes from 1L and added comma after id.
        String productJson = """
        {
            "id" : 1, 
            "name": "Integration Test Product",
            "type": "ceva",
            "unitOfMeasure": "10",
            "quantity": 10.0
        }
        """;

        // When
        ResultActions response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson));

        // Then
        response.andExpect(status().isCreated())
                // Note: The returned ID might not be exactly 1L if the DB is running,
                // but the integration test assumes successful creation.
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name", is("Integration Test Product")))
                .andExpect(jsonPath("$.type", is("ceva")))
                .andExpect(jsonPath("$.unitOfMeasure", is("10")))
                .andExpect(jsonPath("$.quantity", is(10.0)));
    }

    @Test
    void testUpdateProduct() throws Exception {
        // First create a product
        // CORRECTED JSON: Removed non-existent 'price' field. Set required fields.
        String createJson = """
            {
                "name": "Original Name",
                "type": "Original Type",
                "unitOfMeasure": "kg",
                "quantity": 5.0
            }
            """;

        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createJson))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long productId = objectMapper.readTree(response).get("id").asLong();

        // Update the product
        String updateJson = """
            {
                "name": "Updated Name",
                "type": "Updated Type",
                "unitOfMeasure": "lbs",
                "quantity": 15.0
            }
            """;

        mockMvc.perform(put("/api/products/{id}", productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")))
                .andExpect(jsonPath("$.type", is("Updated Type")))
                .andExpect(jsonPath("$.quantity", is(15.0)));
    }

//        // ... (Deletion logic would go here)
    @Test
    void testDeleteProduct() throws Exception {
    String createJson = """
            {
                "name": "Product to Delete",
                "type": "Test Type",
                "unitOfMeasure": "pcs",
                "quantity": 1.0
            }
            """;

    String response = mockMvc.perform(post("/api/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createJson))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();


    Long productId = objectMapper.readTree(response).get("id").asLong();


    mockMvc.perform(delete("/api/products/{id}", productId))
            .andExpect(status().isNoContent()); // Expect 204 for successful deletion//Verify the product is deleted (GET should return 404 Not Found)
    mockMvc.perform(get("/api/products/{id}", productId))
            .andExpect(status().isNotFound());
}
//

}