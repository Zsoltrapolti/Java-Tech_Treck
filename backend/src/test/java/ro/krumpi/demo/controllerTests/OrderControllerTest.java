package ro.krumpi.demo.controllerTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ro.krumpi.demo.config.JwtAuthenticationFilter;
import ro.krumpi.demo.config.RateLimitingFilter;
import ro.krumpi.demo.controller.OrderController;
import ro.krumpi.demo.dto.orders_sapior.OrderDTO;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.service.EmployeeService;
import ro.krumpi.demo.service.OrderService;
import ro.krumpi.demo.service.ProductService;

import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean private OrderService orderService;
    @MockBean private ProductService productService;
    @MockBean private EmployeeService employeeService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private RateLimitingFilter rateLimitingFilter;

    private OrderDTO sampleDto;
    private Employee sampleEmployee;

    @BeforeEach
    void setUp() {
        sampleEmployee = new Employee();
        sampleEmployee.setId(10L);
        sampleEmployee.setFirstName("John");
        sampleEmployee.setLastName("Doe");

        sampleDto = new OrderDTO();
        sampleDto.setResponsibleEmployeeId(10L);
        sampleDto.setItems(new ArrayList<>());
    }

    // ... Existing getOrderById tests ...

    @Test
    @DisplayName("POST /api/orders/{id}/deliver - Success")
    void markOrderAsDelivered_Success() throws Exception {
        doNothing().when(orderService).markDelivered(1L);

        mockMvc.perform(post("/api/orders/1/deliver"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/orders/{id}/cancel - Success")
    void cancelOrder_Success() throws Exception {
        doNothing().when(orderService).cancel(1L);

        mockMvc.perform(post("/api/orders/1/cancel"))
                .andExpect(status().isOk());
    }

//    @Test
//    @DisplayName("PUT /api/orders/{id} - Fail when Employee missing")
//    void updateOrder_EmployeeNotFound_ThrowsException() throws Exception {
//        // Arrange: Service returns empty Optional for the employee ID in the DTO
//        when(employeeService.getEmployeeById(anyLong())).thenReturn(Optional.empty());
//
//        // Act & Assert
//        mockMvc.perform(put("/api/orders/1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(sampleDto)))
//                .andExpect(status().isInternalServerError());
//    }

    @Test
    @DisplayName("DELETE /api/orders/{id} - Verify service call")
    void deleteOrder_VerifyInteraction() throws Exception {
        mockMvc.perform(delete("/api/orders/55"))
                .andExpect(status().isNoContent());

        verify(orderService, times(1)).deleteOrder(55L);
    }
}