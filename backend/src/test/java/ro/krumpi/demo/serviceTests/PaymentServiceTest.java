package ro.krumpi.demo.serviceTests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.PaymentRequest;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.*;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.model.stock.ShoppingCart;
import ro.krumpi.demo.repository.*;
import ro.krumpi.demo.service.EmailService;
import ro.krumpi.demo.service.PaymentService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private InvoiceRecordRepository invoiceRepository;
    @Mock private UserAccountRepository userRepository;
    @Mock private ShoppingCartRepository cartRepository;
    @Mock private ProductRepository productRepository;
    @Mock private EmailService emailService;

    @InjectMocks
    private PaymentService paymentService;

    private UserAccount user;
    private InvoiceRecord invoice;
    private PaymentRequest paymentRequest;

    @BeforeEach
    void setUp() {
        user = new UserAccount();
        user.setId(1L);
        user.setUsername("testuser@test.ro");

        InvoiceLine line = new InvoiceLine();
        line.setProductName("Laptop");
        line.setQuantity(1);
        line.setPricePerUnit(1000.0);
        line.setLineTotalValue(1000.0);

        // We use the builder but MANUALLY provide the list because
        // without @Builder.Default, the builder would set 'lines' to null.
        invoice = InvoiceRecord.builder()
                .id(100L)
                .seriesNumber("INV-2026-001")
                .issuedAt(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(14))
                .buyer(user)
                .status(PaymentStatus.PENDING_PAYMENT)
                // FIX: Populate these to prevent the java.lang.Double NPE in the Mapper
                .totalNet(1000.0)
                .totalVat(190.0)
                .totalGross(1190.0)
                .lines(new ArrayList<>(List.of(line)))
                .build();

        line.setInvoiceRecord(invoice);

        paymentRequest = new PaymentRequest();
        paymentRequest.setInvoiceId(100L);
        paymentRequest.setPaymentMethod(PaymentMethod.CARD);
    }

    @Test
    @DisplayName("Process Payment: Success Path")
    void processPayment_Success() {
        // Arrange
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(invoiceRepository.findById(100L)).thenReturn(Optional.of(invoice));

        // FIX: Match the exact arguments ("Laptop", 1.0) to resolve PotentialStubbingProblem
        when(productRepository.decrementStock(eq("Laptop"), eq(1))).thenReturn(1);

        when(invoiceRepository.save(any(InvoiceRecord.class))).thenReturn(invoice);

        // Act
        InvoiceDTO result = paymentService.processPayment(user.getUsername(), paymentRequest);

        // Assert
        assertNotNull(result);
        assertEquals(PaymentStatus.PAID, invoice.getStatus());
        verify(emailService).sendPaymentConfirmation(eq(user.getUsername()), any(InvoiceDTO.class));
    }

    @Test
    @DisplayName("Process Payment: Out of Stock")
    void processPayment_OutOfStock() {
        // Arrange
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(invoiceRepository.findById(100L)).thenReturn(Optional.of(invoice));
        when(productRepository.decrementStock("Laptop", 1)).thenReturn(0);

        // Act & Assert
        assertThrows(RuntimeException.class, () ->
                paymentService.processPayment(user.getUsername(), paymentRequest));
    }

    @Test
    @DisplayName("Cancel Payment: Success Path")
    void cancelPayment_Success() {
        // Arrange
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(invoiceRepository.findById(100L)).thenReturn(Optional.of(invoice));

        Product product = new Product();
        product.setId(5L);
        product.setName("Laptop");
        when(productRepository.findByName("Laptop")).thenReturn(product);

        ShoppingCart cart = new ShoppingCart();
        cart.setItems(new ArrayList<>());
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        // Act
        paymentService.cancelPayment(user.getUsername(), 100L);

        // Assert
        assertEquals(PaymentStatus.CANCELLED, invoice.getStatus());
        assertFalse(cart.getItems().isEmpty());
        verify(invoiceRepository).save(invoice);
    }
}