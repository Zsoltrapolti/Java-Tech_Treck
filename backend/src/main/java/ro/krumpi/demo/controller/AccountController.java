package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.service.AccountRequestService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
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
}
