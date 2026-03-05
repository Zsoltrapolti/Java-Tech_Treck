package ro.krumpi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRecordRepository extends JpaRepository<InvoiceRecord, Long> {

    List<InvoiceRecord> findByBuyer(UserAccount buyer);
    List<InvoiceRecord> findByBuyerAndStatus(UserAccount buyer, PaymentStatus status);
    List<InvoiceRecord> findByBuyerAndStatusAndDueDateBefore(UserAccount buyer, PaymentStatus status, LocalDateTime date);
    List<InvoiceRecord> findAllByStatusAndDueDateBeforeAndReminderSentFalse(PaymentStatus status, LocalDateTime date);

    List<InvoiceRecord> findByBuyerIdAndIssuedAtBetween(Long clientId, LocalDateTime start, LocalDateTime end);
}
    List<InvoiceRecord> findByBuyerAndStatus(UserAccount buyer, PaymentStatus status);
    List<InvoiceRecord> findByBuyer_ManagedBy(UserAccount managedBy);
}
