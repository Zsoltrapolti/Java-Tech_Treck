package ro.krumpi.demo.serviceTests;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.service.EmailService;
import ro.krumpi.demo.service.InvoiceNotificationScheduler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceNotificationSchedulerTest {

    @Mock
    private InvoiceRecordRepository invoiceRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private InvoiceNotificationScheduler scheduler;

    private InvoiceRecord overdueInvoice;
    private UserAccount buyer;

    @BeforeEach
    void setUp() {
        buyer = new UserAccount();
        buyer.setUsername("client@test.ro");

        overdueInvoice = InvoiceRecord.builder()
                .seriesNumber("INV-2026-001")
                .clientName("Test Client")
                .buyer(buyer)
                .dueDate(LocalDateTime.now().minusDays(2))
                .totalGross(500.0)
                .status(PaymentStatus.PENDING_PAYMENT)
                .reminderSent(false)
                .build();
    }

    @Test
    @DisplayName("processOverdueInvoices: Should send email and mark as sent")
    void processOverdueInvoices_Success() {
        // Arrange
        when(invoiceRepository.findAllByStatusAndDueDateBeforeAndReminderSentFalse(
                eq(PaymentStatus.PENDING_PAYMENT), any(LocalDateTime.class)))
                .thenReturn(List.of(overdueInvoice));

        // Act
        scheduler.processOverdueInvoices();

        // Assert
        verify(emailService).sendPaymentReminder(
                eq("client@test.ro"),
                eq("Test Client"),
                eq("INV-2026-001"),
                eq(500.0),
                anyString()
        );

        assertTrue(overdueInvoice.isReminderSent());
        verify(invoiceRepository).save(overdueInvoice);
    }

    @Test
    @DisplayName("processOverdueInvoices: Should continue processing even if one email fails")
    void processOverdueInvoices_EmailFailure() {
        // Arrange
        InvoiceRecord secondInvoice = InvoiceRecord.builder()
                .seriesNumber("INV-2026-002")
                .buyer(buyer)
                .dueDate(LocalDateTime.now().minusDays(1))
                .reminderSent(false)
                .build();

        when(invoiceRepository.findAllByStatusAndDueDateBeforeAndReminderSentFalse(any(), any()))
                .thenReturn(List.of(overdueInvoice, secondInvoice));

        // Mock first email to fail
        doThrow(new RuntimeException("SMTP Server Down"))
                .when(emailService).sendPaymentReminder(eq(buyer.getUsername()), any(), eq("INV-2026-001"), any(), any());

        // Act
        scheduler.processOverdueInvoices();

        // Assert
        // The first one should NOT be marked as sent because of the exception
        verify(invoiceRepository, never()).save(overdueInvoice);

        // The second one SHOULD still be processed
        verify(emailService).sendPaymentReminder(eq(buyer.getUsername()), any(), eq("INV-2026-002"), any(), any());
        assertTrue(secondInvoice.isReminderSent());
        verify(invoiceRepository).save(secondInvoice);
    }

    @Test
    @DisplayName("processOverdueInvoices: Should log and exit if no invoices found")
    void processOverdueInvoices_EmptyList() {
        // Arrange
        when(invoiceRepository.findAllByStatusAndDueDateBeforeAndReminderSentFalse(any(), any()))
                .thenReturn(new ArrayList<>());

        // Act
        scheduler.processOverdueInvoices();

        // Assert
        verify(emailService, never()).sendPaymentReminder(any(), any(), any(), any(), any());
        verify(invoiceRepository, never()).save(any());
    }
}