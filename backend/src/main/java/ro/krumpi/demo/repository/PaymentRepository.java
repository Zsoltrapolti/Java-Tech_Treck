package ro.krumpi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.krumpi.demo.model.shopping.Payment;
import ro.krumpi.demo.model.auth.UserAccount;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(UserAccount user);
}