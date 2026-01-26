package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.service.AccountRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountRequestService accountRequestService;

    @Operation(
            summary = "Get all accounts",
            description = "Returns a list of all accounts"
    )
    @GetMapping
    public List<AccountRequest> getAllRegisteredAccounts() {
        return accountRequestService.getAllRegistered();
    }

    @Operation(summary = "Update assigned role for an account")
    @PutMapping("/{id}/role")
    public AccountRequest updateRole(
            @PathVariable Long id,
            @RequestBody String assignedRole
    ) {
        Role role;
        try {
            role = Role.valueOf(assignedRole.replace("\"", ""));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid role: " + assignedRole);
        }

        return accountRequestService.updateRole(id, role);
    }

    @Operation(summary = "Get account by ID")
    @GetMapping("/{id}")
    public AccountRequest getAccountById(@PathVariable Long id) {
        return accountRequestService.findById(id);
    }
}
