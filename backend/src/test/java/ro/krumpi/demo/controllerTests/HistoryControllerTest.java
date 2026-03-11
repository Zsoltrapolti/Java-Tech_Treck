package ro.krumpi.demo.controllerTests;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.krumpi.demo.config.JwtAuthenticationFilter;
import ro.krumpi.demo.config.RateLimitingFilter;
import ro.krumpi.demo.controller.HistoryController;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.Payment;
import ro.krumpi.demo.model.shopping.PaymentMethod;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.repository.PaymentRepository;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HistoryController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypass Security filters for unit testing
class HistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private PaymentRepository paymentRepository;
    @MockBean private InvoiceRecordRepository invoiceRecordRepository;
    @MockBean private UserAccountRepository userAccountRepository;

    // Mocking filters to avoid application context loading issues
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private RateLimitingFilter rateLimitingFilter;

    private UserAccount mockUser;
    private final String USERNAME = "user@test.ro";

    @BeforeEach
    void setUp() {
        mockUser = new UserAccount();
        mockUser.setId(1L);
        mockUser.setUsername(USERNAME);
    }

    @Test
    @WithMockUser(username = USERNAME)
    @DisplayName("GET /api/history/payments - Verify Full Mapping")
    void getMyPaymentHistory_FullMapping() throws Exception {
        // Arrange
        InvoiceRecord mockInvoice = new InvoiceRecord();
        mockInvoice.setId(50L);

        Payment payment = Payment.builder()
                .id(200L)
                .amount(150.50)
                .method(PaymentMethod.CARD)
                .status(PaymentStatus.PAID)
                .transactionId("TXN_12345")
                .paymentDate(LocalDateTime.now())
                .user(mockUser)
                .invoice(mockInvoice)
                .build();

        when(userAccountRepository.findByUsername(USERNAME)).thenReturn(Optional.of(mockUser));
        when(paymentRepository.findByUser(mockUser)).thenReturn(List.of(payment));

        // Act & Assert
        mockMvc.perform(get("/api/history/payments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(200))
                .andExpect(jsonPath("$[0].invoiceId").value(50)) // Verifies OneToOne mapping
                .andExpect(jsonPath("$[0].method").value("CARD")) // Verifies Enum string conversion
                .andExpect(jsonPath("$[0].status").value("PAID"))
                .andExpect(jsonPath("$[0].transactionId").value("TXN_12345"));
    }

    @Test
    @WithMockUser(username = USERNAME)
    @DisplayName("GET /api/history/payments - Handle Null Enum Values")
    void getMyPaymentHistory_NullEnums() throws Exception {
        // Arrange: Create a payment with missing optional fields
        Payment incompletePayment = new Payment();
        incompletePayment.setId(300L);
        incompletePayment.setAmount(10.0);
        // Method and Status left as null

        when(userAccountRepository.findByUsername(USERNAME)).thenReturn(Optional.of(mockUser));
        when(paymentRepository.findByUser(mockUser)).thenReturn(List.of(incompletePayment));

        // Act & Assert
        mockMvc.perform(get("/api/history/payments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].method").isEmpty()) // Verifies ternary null check in controller
                .andExpect(jsonPath("$[0].status").isEmpty());
    }
}
