package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.OrderSummaryDTO;
import ro.krumpi.demo.mapper.InvoiceMapper;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.service.InvoiceService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService checkoutService;
    private final InvoiceRecordRepository invoiceRepository;

    @Operation(
            summary = "Place Order (Checkout)",
            description = "Processes the checkout for the current user's shopping cart and returns the invoice ID"
    )
    @PostMapping("/checkout")
    public ResponseEntity<OrderSummaryDTO> performCheckout(Principal principal) {
        InvoiceRecord pendingOrder = checkoutService.checkout(principal.getName());
        OrderSummaryDTO summary = new OrderSummaryDTO(
                pendingOrder.getId(),
                "Order " + pendingOrder.getSeriesNumber(),
                pendingOrder.getTotalGross(),
                pendingOrder.getStatus().name()
        );
        return ResponseEntity.ok(summary);
    }

    @Operation(
            summary = "Get invoice by ID",
            description = "Returns the invoice details for a given invoice ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> getInvoiceData(@PathVariable Long id) {
        InvoiceRecord inv = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        if (inv.getStatus() != PaymentStatus.PAID) {
            throw new RuntimeException("Factura fiscală nu este disponibilă. Comanda nu a fost achitată încă.");
        }
        InvoiceDTO dto = InvoiceMapper.toDTO(inv);
        return ResponseEntity.ok(dto);
    }

    @Operation(
            summary = "Get all my orders",
            description = "Returns a list of all orders (Pending, Paid, Cancelled) for the current user."
    )
    @GetMapping
    public ResponseEntity<List<OrderSummaryDTO>> getMyInvoices(Principal principal) {
        List<InvoiceRecord> invoices = checkoutService.getMyInvoices(principal.getName());

        List<OrderSummaryDTO> summaryList = invoices.stream()
                .map(inv -> new OrderSummaryDTO(
                        inv.getId(),
                        "Order " + inv.getSeriesNumber(),
                        inv.getTotalGross(),
                        inv.getStatus().name()
                ))
                .toList();

        return ResponseEntity.ok(summaryList);
    }
}