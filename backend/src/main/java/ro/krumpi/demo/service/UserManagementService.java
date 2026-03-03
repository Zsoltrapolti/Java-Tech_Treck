package ro.krumpi.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.util.List;

@Service
public class UserManagementService {

    private final UserAccountRepository userAccountRepository;

    public UserManagementService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public List<UserAccount> getUnassignedClients() {
        return userAccountRepository.findByRoleAndManagedByIsNull(Role.USER);
    }

    public List<UserAccount> getMyClients(Long employeeUserId) {
        UserAccount employee = userAccountRepository.findById(employeeUserId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getRole() != Role.EMPLOYEE && employee.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only EMPLOYEE or ADMIN can manage clients");
        }

        return userAccountRepository.findByManagedBy(employee);
    }

    // Asignează un client unui employee
    @Transactional
    public void claimClient(Long employeeUserId, Long clientUserId) {
        UserAccount employee = userAccountRepository.findById(employeeUserId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getRole() != Role.EMPLOYEE && employee.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only EMPLOYEE or ADMIN can claim clients");
        }

        UserAccount client = userAccountRepository.findById(clientUserId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (client.getRole() != Role.USER) {
            throw new RuntimeException("Can only claim users with role USER");
        }

        if (client.getManagedBy() != null) {
            throw new RuntimeException("This client is already assigned!");
        }

        client.setManagedBy(employee);
        userAccountRepository.save(client);
    }
}
