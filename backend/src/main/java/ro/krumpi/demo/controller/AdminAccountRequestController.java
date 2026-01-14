package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.AdminReviewAccountRequestDTO;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.service.AccountRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/account-requests")
public class AdminAccountRequestController {

    private final AccountRequestService service;

    public AdminAccountRequestController(AccountRequestService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AccountRequest>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @Operation(
            summary = "Review a request",
            description = "Approve or deny an account requent"
    )
    @PutMapping("/{id}/review")
    public ResponseEntity<AccountRequest> review(
            @PathVariable Long id,
            @Valid @RequestBody AdminReviewAccountRequestDTO dto
    ) {
        if (dto.approve()) {
            return ResponseEntity.ok(service.approve(id, dto.assignedRole()));
        }
        return ResponseEntity.ok(service.reject(id));
    }

    @Operation(
            summary = "Delete a request",
            description = "Delete an account requent"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
