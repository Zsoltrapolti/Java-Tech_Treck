//package ro.krumpi.demo.contollerTests;
//
//import jakarta.persistence.EntityNotFoundException;
//import ro.krumpi.demo.config.TestSecurityConfig;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.ResultActions;
//
//import static org.hamcrest.Matchers.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest(properties = {
//        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE",
//        "spring.datasource.driver-class-name=org.h2.Driver",
//        "spring.datasource.username=sa",
//        "spring.datasource.password=",
//        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
//        "spring.jpa.hibernate.ddl-auto=create-drop",
//        "spring.flyway.enabled=false"
//})
//@AutoConfigureMockMvc(addFilters = false)
//@ActiveProfiles("test")
//class ProductControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//
//    void createProduct_shouldReturnCreatedProduct() throws Exception {
//        String productJson = """
//        {
//            "id" : 1,
//            "name": "Integration Test Product",
//            "type": "ceva",
//            "unitOfMeasure": "10",
//            "quantity": 10.0
//        }
//        """;
//
//        ResultActions response = mockMvc.perform(post("/api/products")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(productJson));
//
//        response.andExpect(status().isCreated())
//                .andExpect(jsonPath("$.id").isNumber())
//                .andExpect(jsonPath("$.name", is("Integration Test Product")))
//                .andExpect(jsonPath("$.type", is("ceva")))
//                .andExpect(jsonPath("$.unitOfMeasure", is("10")))
//                .andExpect(jsonPath("$.quantity", is(10.0)));
//    }
//
//    @Test
//    void testUpdateProduct() throws Exception {
//        String createJson = """
//            {
//                "name": "Original Name",
//                "type": "Original Type",
//                "unitOfMeasure": "kg",
//                "quantity": 5.0
//            }
//            """;
//
//        String response = mockMvc.perform(post("/api/products")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(createJson))
//                .andReturn()
//                .getResponse()
//                .getContentAsString();
//
//        Long productId = objectMapper.readTree(response).get("id").asLong();
//
//        String updateJson = """
//            {
//                "name": "Updated Name",
//                "type": "Updated Type",
//                "unitOfMeasure": "lbs",
//                "quantity": 15.0
//            }
//            """;
//
//        mockMvc.perform(put("/api/products/{id}", productId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(updateJson))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.name", is("Updated Name")))
//                .andExpect(jsonPath("$.type", is("Updated Type")))
//                .andExpect(jsonPath("$.quantity", is(15.0)));
//    }
//
//    //        // ... (Deletion logic would go here)
//    @Test
//    void testDeleteProduct() throws Exception {
//     //cream produs de test si verificam pe pasi operatiunile
//        String createJson = """
//        {
//            "name": "Product to Delete",
//            "type": "Test Type",
//            "unitOfMeasure": "pcs",
//            "quantity": 1.0
//        }
//        """;
//
//        String response = mockMvc.perform(post("/api/products")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(createJson))
//                .andExpect(status().isCreated())
//                .andReturn().getResponse().getContentAsString();
//
//        Long productId = objectMapper.readTree(response).get("id").asLong();
//
//        // stergem produsul
//        mockMvc.perform(delete("/api/products/{id}", productId))
//                .andExpect(status().isNoContent());
//
//        // verificam ca ii
//        mockMvc.perform(get("/api/products/{id}", productId))
//                .andExpect(result -> {
//                    if (!(result.getResolvedException() instanceof EntityNotFoundException)) {
//                        throw new AssertionError("Expected EntityNotFoundException but was: "
//                                + result.getResolvedException());
//                    }
//                });
//    }
////
//
//}