package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.PaymentDTO;
import ro.krumpi.demo.dto.shopping.PaymentRequest;
import ro.krumpi.demo.service.PaymentService;

import java.security.Principal;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(
            summary = "Process Payment",
            description = "Pay an existing invoice. Updates invoice status to PAID."
    )
    @PostMapping
    public ResponseEntity<InvoiceDTO> payInvoice(@Valid @RequestBody PaymentRequest request, Principal principal) {
        InvoiceDTO finalInvoice = paymentService.processPayment(principal.getName(), request);
        return ResponseEntity.ok(finalInvoice);
    }

    @Operation(
            summary = "Cancel Payment",
            description = "Cancels a pending invoice and returns items to the shopping cart."
    )
    @PostMapping("/cancel/{invoiceId}")
    public ResponseEntity<Void> cancelPayment(@PathVariable Long invoiceId, Principal principal) {
        paymentService.cancelPayment(principal.getName(), invoiceId);
        return ResponseEntity.ok().build();
    }
}
