package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final UserAccountRepository userAccountRepository;
    public record AccountDTO(Long id, String username, String role) {}

    @Operation(
            summary = "Get all accounts",
            description = "Returns a list of all actual registered accounts"
    )
    @GetMapping
    public List<AccountDTO> getAllRegisteredAccounts() {
        return userAccountRepository.findAll().stream()
                .map(user -> new AccountDTO(user.getId(), user.getUsername(), user.getRole().name()))
                .toList();
    }

    @Operation(summary = "Update assigned role for an account")
    @PutMapping("/{id}/role")
    public AccountDTO updateRole(
            @PathVariable Long id,
            @RequestBody String assignedRole
    ) {
        Role role;
        try {
            role = Role.valueOf(assignedRole.replace("\"", ""));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid role: " + assignedRole);
        }

        UserAccount user = userAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        userAccountRepository.save(user);

        return new AccountDTO(user.getId(), user.getUsername(), user.getRole().name());
    }

    @Operation(summary = "Get account by ID")
    @GetMapping("/{id}")
    public AccountDTO getAccountById(@PathVariable Long id) {
        UserAccount user = userAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AccountDTO(user.getId(), user.getUsername(), user.getRole().name());
    }
}