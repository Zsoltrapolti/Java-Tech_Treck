package ro.krumpi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.auth.UserAccount;

import java.util.List;

public interface InvoiceRecordRepository extends JpaRepository<InvoiceRecord, Long> {

    List<InvoiceRecord> findByBuyer(UserAccount buyer);
}