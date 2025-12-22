package com.example.demo.contollerTests;

import com.example.demo.config.TestSecurityConfig;
import com.example.demo.model.employee.Employee;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = {
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
})
class EmployeeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // CREATE
    @Test
    void createEmployee_shouldReturnCreatedEmployee() throws Exception {
        String employeeJson = """
        {
            "firstName": "John",
            "lastName": "Doe",
            "role": "Manager"
        }
        """;

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson))
                .andExpect(status().isOk()) // EmployeeController returns direct object, not 'Created'
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")))
                .andExpect(jsonPath("$.role", is("Manager")));
    }

    // UPDATE
    @Test
    void updateEmployee_shouldModifyEmployee() throws Exception {
        String createJson = """
        {
            "firstName": "Alice",
            "lastName": "Smith",
            "role": "Worker"
        }
        """;

        String createdResponse = mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createJson))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long employeeId = objectMapper.readTree(createdResponse).get("id").asLong();

        String updateJson = """
        {
            "firstName": "AliceUpdated",
            "lastName": "SmithUpdated",
            "role": "Supervisor"
        }
        """;

        mockMvc.perform(put("/api/employees/{id}", employeeId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("AliceUpdated")))
                .andExpect(jsonPath("$.lastName", is("SmithUpdated")))
                .andExpect(jsonPath("$.role", is("Supervisor")));
    }

    // DELETE
    @Test
    void deleteEmployee_shouldReturnNoContent() throws Exception {
        String createJson = """
        {
            "firstName": "DeleteMe",
            "lastName": "User",
            "role": "Staff"
        }
        """;

        String response = mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createJson))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long employeeId = objectMapper.readTree(response).get("id").asLong();

        // Delete
        mockMvc.perform(delete("/api/employees/{id}", employeeId))
                .andExpect(status().isNoContent());

        // Verify deletion
        mockMvc.perform(get("/api/employees/{id}", employeeId))
                .andExpect(status().isNotFound());
    }

    // GET ALL
    @Test
    void getAllEmployees_shouldReturnList() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
