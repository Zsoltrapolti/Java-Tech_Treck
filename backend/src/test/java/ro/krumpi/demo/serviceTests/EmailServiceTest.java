//package ro.krumpi.demo.serviceTests;
//
//
//
//
//import jakarta.mail.Session;
//import jakarta.mail.internet.MimeMessage;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.ArgumentCaptor;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import ro.krumpi.demo.dto.shopping.InvoiceDTO;
//import ro.krumpi.demo.dto.shopping.InvoiceItemDTO;
//import ro.krumpi.demo.service.EmailService;
//
//import java.util.List;
//import java.util.Properties;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class EmailServiceTest {
//
//    @Mock
//    private JavaMailSender mailSender;
//
//    @InjectMocks
//    private EmailService emailService;
//
//    private InvoiceDTO sampleInvoice;
//
//    @BeforeEach
//    void setUp() {
//        InvoiceItemDTO item = new InvoiceItemDTO(
//                1L,
//                "Premium Widget",  // <--- Try putting the Name here (2nd arg)
//                "PRD-001",         // <--- And the Code here (3rd arg)
//                2,
//                50.0,
//                100.0
//        );
//
//        // ... rest of the setup
//    }
//    @Test
//    @DisplayName("Test sendPaymentConfirmation: Verifies email content and recipient")
//    void sendPaymentConfirmation_Success() {
//        // Arrange
//        String toEmail = "client@example.ro";
//        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
//
//        // Act
//        emailService.sendPaymentConfirmation(toEmail, sampleInvoice);
//
//        // Assert
//        verify(mailSender).send(captor.capture());
//        SimpleMailMessage sentMessage = captor.getValue();
//
//        // Check Recipient
//        assertNotNull(sentMessage.getTo());
//        assertEquals(toEmail, sentMessage.getTo()[0]);
//
//        // Check Content pieces individually to find exactly what is missing
//        String body = sentMessage.getText();
//        assertNotNull(body, "Email body should not be null");
//
//        assertTrue(body.contains("Hello Alex Krumpi"), "Should contain client name");
//        assertTrue(body.contains("Premium Widget"), "Should contain product name");
//        assertTrue(body.contains("x 2"), "Should contain quantity");
//        assertTrue(body.contains("100.0 RON"), "Should contain total value");
//    }
//    @Test
//    @DisplayName("Test sendPaymentReminder: Verifies MimeMessage interaction")
//    void sendPaymentReminder_Success() {
//        // Arrange
//        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
//        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
//
//        // Act & Assert
//        assertDoesNotThrow(() ->
//                emailService.sendPaymentReminder(
//                        "debtor@test.ro", "Alex", "KRP-99", 250.0, "2026-05-15"
//                )
//        );
//
//        verify(mailSender).send(any(MimeMessage.class));
//    }
//
//    @Test
//    @DisplayName("Test Error Handling: Ensure no crash on mail server failure")
//    void sendPaymentConfirmation_HandlesException() {
//        // Arrange
//        doThrow(new RuntimeException("Connection Refused"))
//                .when(mailSender).send(any(SimpleMailMessage.class));
//
//        // Act & Assert
//        assertDoesNotThrow(() ->
//                emailService.sendPaymentConfirmation("test@test.ro", sampleInvoice)
//        );
//    }
//}