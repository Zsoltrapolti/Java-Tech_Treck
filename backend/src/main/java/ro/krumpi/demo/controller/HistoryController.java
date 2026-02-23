package ro.krumpi.demo.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.InvoiceItemDTO;
import ro.krumpi.demo.dto.shopping.PaymentDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.Payment;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.repository.PaymentRepository;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final PaymentRepository paymentRepository;
    private final InvoiceRecordRepository invoiceRecordRepository;
    private final UserAccountRepository userAccountRepository;

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDTO>> getMyPaymentHistory() {
        UserAccount user = getCurrentUser();
        List<Payment> payments = paymentRepository.findByUser(user);

        List<PaymentDTO> dtos = payments.stream()
                .map(this::mapToPaymentDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<InvoiceDTO>> getMyOrderHistory() {
        UserAccount user = getCurrentUser();
        List<InvoiceRecord> invoices = invoiceRecordRepository.findByBuyer(user);

        List<InvoiceDTO> dtos = invoices.stream()
                .map(this::mapToInvoiceDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/admin/all-user-orders")
    public ResponseEntity<List<InvoiceDTO>> getAllUserOrders() {
        List<InvoiceRecord> allInvoices = invoiceRecordRepository.findAll();

        List<InvoiceDTO> dtos = allInvoices.stream()
                .map(this::mapToInvoiceDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private UserAccount getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private PaymentDTO mapToPaymentDTO(Payment p) {
        return PaymentDTO.builder()
                .id(p.getId())
                .invoiceId(p.getInvoice() != null ? p.getInvoice().getId() : null)
                .amount(p.getAmount())
                .method(p.getMethod() != null ? p.getMethod().name() : null)
                .status(p.getStatus() != null ? p.getStatus().name() : null)
                .transactionId(p.getTransactionId())
                .date(p.getPaymentDate())
                .build();
    }

    private InvoiceDTO mapToInvoiceDTO(InvoiceRecord inv) {
        List<InvoiceItemDTO> items = inv.getLines().stream()
                .map(line -> new InvoiceItemDTO(
                        line.getId(),
                        line.getProductName(),
                        line.getUnitOfMeasure(),
                        line.getQuantity() != null ? line.getQuantity() : 0,
                        line.getPricePerUnit() != null ? line.getPricePerUnit() : 0.0,
                        line.getLineTotalValue() != null ? line.getLineTotalValue() : 0.0
                )).collect(Collectors.toList());

        return InvoiceDTO.builder()
                .id(inv.getId())
                .number(inv.getSeriesNumber())
                .date(inv.getIssuedAt() != null ? inv.getIssuedAt().toString() : null)
                .dueDate(inv.getDueDate() != null ? inv.getDueDate().toString() : null)
                .clientName(inv.getClientName())
                .clientAddress(inv.getClientAddress())
                .totalNet(inv.getTotalNet() != null ? inv.getTotalNet() : 0.0)
                .totalVat(inv.getTotalVat() != null ? inv.getTotalVat() : 0.0)
                .totalGross(inv.getTotalGross() != null ? inv.getTotalGross() : 0.0)
                .status(inv.getStatus() != null ? inv.getStatus().name() : null)
                .items(items)
                .build();
    }
}