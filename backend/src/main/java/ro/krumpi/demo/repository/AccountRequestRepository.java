package ro.krumpi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.krumpi.demo.model.auth.AccountRequest;

import java.util.Optional;

public interface AccountRequestRepository extends JpaRepository<AccountRequest, Long> {
    Optional<AccountRequest> findByEmail(String email);
    boolean existsByEmail(String email);
}
