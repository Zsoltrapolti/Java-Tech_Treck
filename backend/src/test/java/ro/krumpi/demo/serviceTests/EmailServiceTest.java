package ro.krumpi.demo.serviceTests;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.InvoiceItemDTO;
import ro.krumpi.demo.service.EmailService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    @DisplayName("sendPaymentConfirmation: Should build correct plain text body")
    void sendPaymentConfirmation_Success() {
        // Arrange
        InvoiceItemDTO item = new InvoiceItemDTO(1L, "Widget", "pcs", 2, 10.0, 20.0);
        InvoiceDTO invoice = InvoiceDTO.builder()
                .series("INV")
                .number("123")
                .clientName("John Doe")
                .totalGross(20.0)
                .items(List.of(item))
                .build();

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        // Act
        emailService.sendPaymentConfirmation("test@client.ro", invoice);

        // Assert
        verify(mailSender).send(messageCaptor.capture());
        SimpleMailMessage capturedMessage = messageCaptor.getValue();

        assertEquals("test@client.ro", capturedMessage.getTo()[0]);
        assertEquals("Order Confirmation #INV123", capturedMessage.getSubject());

        String body = capturedMessage.getText();
        assertTrue(body.contains("Hello John Doe"));
        assertTrue(body.contains("- Widget x 2 (20.0 RON)"));
        assertTrue(body.contains("Total: 20.0 RON"));
    }

    @Test
    @DisplayName("sendPaymentReminder: Should create and send MimeMessage")
    void sendPaymentReminder_Success() {
        // Arrange
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Act
        emailService.sendPaymentReminder(
                "reminder@test.ro",
                "Alice",
                "INV-999",
                150.758, // Testing formatting
                "2026-03-03"
        );

        // Assert
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
        // Note: content check for MimeMessage is complex; we primarily verify the call was made.
    }

    @Test
    @DisplayName("sendPaymentConfirmation: Should catch exception when mail server is down")
    void sendPaymentConfirmation_HandlesException() {
        // Arrange
        InvoiceDTO invoice = InvoiceDTO.builder().items(List.of()).build();
        doThrow(new RuntimeException("Connection failed")).when(mailSender).send(any(SimpleMailMessage.class));

        // Act & Assert
        // The service has a try-catch, so it shouldn't re-throw the exception
        assertDoesNotThrow(() -> emailService.sendPaymentConfirmation("error@test.ro", invoice));
        verify(mailSender).send(any(SimpleMailMessage.class));
    }
}