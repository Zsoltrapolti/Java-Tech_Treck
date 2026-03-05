package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.shopping.CheckoutRequestDTO;
import ro.krumpi.demo.dto.shopping.ClientBalanceDTO;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.OrderSummaryDTO;
import ro.krumpi.demo.mapper.InvoiceMapper;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.service.EmailService;
import ro.krumpi.demo.service.InvoiceService;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService checkoutService;
    private final InvoiceRecordRepository invoiceRepository;
    private final EmailService emailService;

    @Operation(
            summary = "Place Order (Checkout)",
            description = "Processes the checkout for the current user's shopping cart using provided billing details"
    )
    @PostMapping("/checkout")
    public ResponseEntity<OrderSummaryDTO> performCheckout(
            @RequestBody CheckoutRequestDTO checkoutData,
            Principal principal) {

        InvoiceRecord pendingOrder = checkoutService.checkout(principal.getName(), checkoutData);

        OrderSummaryDTO summary = new OrderSummaryDTO(
                pendingOrder.getId(),
                "Order " + pendingOrder.getSeriesNumber(),
                pendingOrder.getTotalGross(),
                pendingOrder.getStatus().name()
        );
        return ResponseEntity.ok(summary);
    }

    // ---> NEW METHOD ADDED HERE (Must be above the /{id} route!) <---
    @Operation(
            summary = "Get Client Tax Balance",
            description = "Returns the financial balance for a specific client within a date range."
    )
    @GetMapping("/balance")
    public ResponseEntity<ClientBalanceDTO> getClientBalance(
            @RequestParam Long clientId,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        // 1. Parse strings to LocalDateTime (From 00:00 to 23:59)
        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);

        // 2. Fetch invoices for this client within the date range
        List<InvoiceRecord> invoices = invoiceRepository.findByBuyerIdAndIssuedAtBetween(clientId, start, end);

        // 3. Calculate totals
        double totalInvoiced = 0.0;
        double totalPaid = 0.0;
        double totalPending = 0.0;

        for (InvoiceRecord inv : invoices) {
            double gross = inv.getTotalGross() != null ? inv.getTotalGross() : 0.0;
            totalInvoiced += gross;

            if (inv.getStatus() == PaymentStatus.PAID) {
                totalPaid += gross;
            } else {
                totalPending += gross;
            }
        }

        // 4. Map invoices to DTOs for the table
        List<OrderSummaryDTO> invoiceDTOs = invoices.stream()
                .map(inv -> new OrderSummaryDTO(
                        inv.getId(),
                        "Order " + inv.getSeriesNumber(),
                        inv.getTotalGross(),
                        inv.getStatus().name()
                ))
                .toList();

        // 5. Build and return the balance DTO
        String username = invoices.isEmpty() ? "Unknown" : invoices.get(0).getBuyer().getUsername();

        ClientBalanceDTO balance = new ClientBalanceDTO(
                clientId, username, totalInvoiced, totalPaid, totalPending, invoiceDTOs
        );

        return ResponseEntity.ok(balance);
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
            throw new RuntimeException("Tax invoice is unavailable. The order has not been paid yet.");
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

    @Operation(summary = "Send Invoice by Email")
    @PostMapping("/{id}/send-email")
    public ResponseEntity<Void> sendInvoiceByEmail(
            @PathVariable Long id,
            @RequestParam String email) {

        InvoiceRecord invoiceRecord = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        InvoiceDTO invoiceDTO = InvoiceMapper.toDTO(invoiceRecord);
        emailService.sendPaymentConfirmation(email, invoiceDTO);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Get my overdue invoices",
            description = "Returns a list of overdue invoices for the currently logged-in user to display notifications."
    )
    @GetMapping("/my-overdue")
    public ResponseEntity<List<OrderSummaryDTO>> getMyOverdueNotifications(Principal principal) {
        List<InvoiceRecord> overdueInvoices = checkoutService.getMyOverdueInvoices(principal.getName());

        List<OrderSummaryDTO> overdueList = overdueInvoices.stream()
                .map(inv -> new OrderSummaryDTO(
                        inv.getId(),
                        "Restanță la factura " + inv.getSeriesNumber(),
                        inv.getTotalGross(),
                        inv.getStatus().name()
                ))
                .toList();

        return ResponseEntity.ok(overdueList);
    }
}