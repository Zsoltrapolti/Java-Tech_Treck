package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.service.EmailService;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceNotificationScheduler {

    private final InvoiceRecordRepository invoiceRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void processOverdueInvoices() {
        log.info("Verific facturile scadente pentru care nu s-a trimis notificare...");

        List<InvoiceRecord> overdueInvoices = invoiceRepository
                .findAllByStatusAndDueDateBeforeAndReminderSentFalse(
                        PaymentStatus.PENDING_PAYMENT,
                        LocalDateTime.now()
                );

        if (overdueInvoices.isEmpty()) {
            log.info("Nu sunt facturi scadente noi.");
            return;
        }

        for (InvoiceRecord invoice : overdueInvoices) {
            String userEmail = invoice.getBuyer().getUsername();
            String dueDateStr = invoice.getDueDate().toLocalDate().toString();

            try {
                emailService.sendPaymentReminder(
                        userEmail,
                        invoice.getClientName(),
                        invoice.getSeriesNumber(),
                        invoice.getTotalGross(),
                        dueDateStr
                );

                invoice.setReminderSent(true);
                invoiceRepository.save(invoice);

                log.info("Notificare trimisă cu succes pentru factura {}", invoice.getSeriesNumber());

            } catch (Exception e) {
                log.error("Eroare la trimiterea emailului pentru factura {}: {}", invoice.getSeriesNumber(), e.getMessage());
            }
        }
    }
}