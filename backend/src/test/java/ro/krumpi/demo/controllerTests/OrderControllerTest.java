
//package ro.krumpi.demo.controllerTests;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//import ro.krumpi.demo.config.SecurityConfig;
//import ro.krumpi.demo.config.JwtAuthenticationFilter;
//import ro.krumpi.demo.config.RateLimitingFilter;
//import ro.krumpi.demo.controller.OrderController;
//import ro.krumpi.demo.model.order.Order;
//import ro.krumpi.demo.service.EmployeeService;
//import ro.krumpi.demo.service.OrderService;
//import ro.krumpi.demo.service.ProductService;
//
//import java.util.Optional;
//
//import static org.mockito.Mockito.when;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(OrderController.class)
//@Import(SecurityConfig.class)
//class OrderControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private OrderService orderService;
//
//    @MockBean
//    private EmployeeService employeeService;
//
//    @MockBean
//    private ProductService productService;
//
//    @MockBean
//    private JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    @MockBean
//    private RateLimitingFilter rateLimitingFilter;
//
//    @Test
//    @WithMockUser(roles = "USER")
//    void getOrderById_AuthenticatedUser_ShouldReturn200() throws Exception {
//        Order order = new Order();
//        order.setId(1L);
//        order.setCustomerName("Teszt Elek");
//
//
//        when(orderService.getOrderById(1L)).thenReturn(Optional.of(order));
//
//        mockMvc.perform(get("/api/orders/1"))
//                .andExpect(status().isOk())
//                // Ha itt még mindig hiba van, az OrderMapper.toOrderDTO-t is ellenőrizni kell!
//                .andExpect(jsonPath("$.customerName").value("Teszt Elek"));
//    }
//
//    @Test
//    void getOrderById_NoAuth_ShouldReturn401() throws Exception {
//        mockMvc.perform(get("/api/orders/1"))
//                .andExpect(status().isUnauthorized()); // A 401 a logikus válasz, ha nincs user
//    }
//
//    @Test
//    @WithMockUser(roles = "USER") // USER-ként próbálunk ADMIN-os műveletet
//    void deleteOrder_AsUser_ShouldReturn403Forbidden() throws Exception {
//        mockMvc.perform(delete("/api/orders/1").with(csrf()))
//                .andExpect(status().isForbidden());
//    }
//
//    @Test
//    @WithMockUser(roles = "ADMIN")
//    void deleteOrder_AsAdmin_ShouldReturn200or204() throws Exception {
//        // A kontrollered ResponseEntity.noContent().build()-et ad vissza, ami 204!
//        mockMvc.perform(delete("/api/orders/1").with(csrf()))
//                .andExpect(status().isNoContent());
//    }
//
//    @Test
//    @WithMockUser(roles = "ADMIN")
//    void markAsDelivered_AsAdmin_ShouldReturn200() throws Exception {
//        mockMvc.perform(post("/api/orders/1/deliver").with(csrf()))
//                .andExpect(status().isOk());
//    }
//}