package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.AccountRequestStatusDTO;
import ro.krumpi.demo.dto.AskAccountRequestDTO;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.service.AccountRequestService;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/account-requests")
public class AccountRequestController {

    private final AccountRequestService service;

    public AccountRequestController(AccountRequestService service) {
        this.service = service;
    }

    @Operation(
            summary = "Create a request",
            description = "Create an account request"
    )
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody AskAccountRequestDTO dto) {
        AccountRequest saved = service.createRequest(dto);
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "status", saved.getStatus().name()
        ));
    }

    @Operation(
            summary = "Check status",
            description = "Check status for an account request"
    )
    @GetMapping("/status")
    public ResponseEntity<AccountRequestStatusDTO> status(@RequestParam String email) {
        return ResponseEntity.ok(service.getStatusByEmail(email));
    }



}
