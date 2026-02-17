package ro.krumpi.demo.controllerTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ro.krumpi.demo.controller.ProductController;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.service.ProductService;
import ro.krumpi.demo.service.EmployeeService; // Szükséges, ha a kontroller függ tőle
import ro.krumpi.demo.config.JwtAuthenticationFilter;
import ro.krumpi.demo.config.RateLimitingFilter;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(controllers = ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private EmployeeService employeeService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private RateLimitingFilter rateLimitingFilter;

    @Test
    void getAllProducts_ShouldReturnList() throws Exception {
        Product p = new Product();
        p.setId(1L);
        p.setName("Sajt");

        when(productService.getAllProducts()).thenReturn(List.of(p));

        mockMvc.perform(get("/api/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Sajt"));
    }
}