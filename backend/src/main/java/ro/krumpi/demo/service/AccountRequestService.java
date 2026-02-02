package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.account.AccountRequestStatusDTO;
import ro.krumpi.demo.dto.account.AskAccountRequestDTO;
import ro.krumpi.demo.mapper.AccountRequestMapper;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.model.auth.AccountRequestStatus;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.repository.AccountRequestRepository;
import ro.krumpi.demo.mapper.AccountRequestMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountRequestService {

    private final AccountRequestRepository repo;

    public AccountRequest createRequest(AskAccountRequestDTO dto) {
        if (repo.existsByEmail(dto.email())) {
            throw new IllegalStateException("Request already exists for this email");
        }

        AccountRequest req = AccountRequestMapper.toEntity(dto);
        return repo.save(req);
    }

    public AccountRequestStatusDTO getStatusByEmail(String email) {
        AccountRequest req = repo.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new IllegalStateException("No request found for this email"));

        return AccountRequestMapper.toStatusDTO(req);
    }

    public List<AccountRequest> findAll() {
        return repo.findAll()
                .stream()
                .toList();
    }

    @Transactional
    public AccountRequest approve(Long id, Role role) {
        AccountRequest req = repo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Request not found"));

        if (role == null) {
            throw new IllegalStateException("Role is required when approving");
        }

        req.setStatus(AccountRequestStatus.APPROVED);
        req.setAssignedRole(role);
        return req;
    }

    @Transactional
    public AccountRequest reject(Long id) {
        AccountRequest req = repo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Request not found"));

        req.setStatus(AccountRequestStatus.REJECTED);
        req.setAssignedRole(null);
        return req;
    }

    public AccountRequest getApprovedRequest(String email) {
        AccountRequest req = repo.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new IllegalStateException("No request found for this email"));

        if (req.getStatus() != AccountRequestStatus.APPROVED) {
            throw new IllegalStateException("Request is not approved");
        }
        if (req.getAssignedRole() == null) {
            throw new IllegalStateException("Approved request has no role assigned");
        }
        return req;
    }

    public void delete(AccountRequest req) {
        repo.delete(req);
    }

    public void deleteRequest(Long id) {
        AccountRequest req = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        repo.delete(req);
    }

    public List<AccountRequest> getAllRegistered() {
        return repo.findAll()
                .stream()
                .filter(req -> req.getStatus() == AccountRequestStatus.REGISTERED)
                .toList();
    }

    public AccountRequest save(AccountRequest req) {
        return repo.save(req);
    }

    public AccountRequest findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Account/Request not found with id: " + id));
    }

    @Transactional
    public AccountRequest updateRole(Long id, Role role) {
        AccountRequest req = repo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Account not found"));

        req.setAssignedRole(role);
        return req;
    }

}
