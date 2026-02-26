package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.account.UserAccountDTO;
import ro.krumpi.demo.mapper.UserAccountMapper;
import ro.krumpi.demo.service.UserManagementService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/client-management")
public class ClientManagementController {

    private final UserManagementService userManagementService;
    private final ro.krumpi.demo.repository.UserAccountRepository userAccountRepository;

    public ClientManagementController(UserManagementService userManagementService,
                                      ro.krumpi.demo.repository.UserAccountRepository userAccountRepository) {
        this.userManagementService = userManagementService;
        this.userAccountRepository = userAccountRepository;
    }

    @Operation(summary = "Get unassigned clients")
    @GetMapping("/unassigned-clients")
    public ResponseEntity<List<UserAccountDTO>> getUnassignedClients() {
        List<UserAccountDTO> clients = userManagementService.getUnassignedClients()
                .stream()
                .map(UserAccountMapper::toDTO)
                .toList();
        return ResponseEntity.ok(clients);
    }

    @Operation(summary = "Get my assigned clients")
    @GetMapping("/my-clients")
    public ResponseEntity<List<UserAccountDTO>> getMyClients(Principal principal) {
        String username = principal.getName();
        var employee = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserAccountDTO> clients = userManagementService.getMyClients(employee.getId())
                .stream()
                .map(UserAccountMapper::toDTO)
                .toList();
        return ResponseEntity.ok(clients);
    }

    @Operation(summary = "Claim a client")
    @PostMapping("/claim-client/{clientId}")
    public ResponseEntity<Void> claimClient(@PathVariable Long clientId, Principal principal) {
        String username = principal.getName();
        var employee = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userManagementService.claimClient(employee.getId(), clientId);
        return ResponseEntity.ok().build();
    }
}
