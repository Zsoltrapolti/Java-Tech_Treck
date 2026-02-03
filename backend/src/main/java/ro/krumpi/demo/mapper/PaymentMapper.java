package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.shopping.PaymentDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.Payment;
import ro.krumpi.demo.model.shopping.PaymentMethod;
import ro.krumpi.demo.model.shopping.PaymentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class PaymentMapper {

    public static PaymentDTO toDTO(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentDTO.builder()
                .id(payment.getId())
                .invoiceId(payment.getInvoice() != null ? payment.getInvoice().getId() : null)
                .amount(payment.getAmount())
                .method(payment.getMethod() != null ? payment.getMethod().name() : null)
                .status(payment.getStatus() != null ? payment.getStatus().name() : null)
                .transactionId(payment.getTransactionId())
                .date(payment.getPaymentDate())
                .build();
    }

    public static Payment createPaymentEntity(UserAccount user, InvoiceRecord invoice, PaymentMethod method) {
        return Payment.builder()
                .amount(invoice.getTotalGross())
                .method(method)
                .user(user)
                .invoice(invoice)
                .paymentDate(LocalDateTime.now())
                .transactionId(UUID.randomUUID().toString())
                .status(PaymentStatus.PAID)
                .build();
    }
}