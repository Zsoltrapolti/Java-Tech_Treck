package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.InvoiceItemDTO;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendPaymentConfirmation(String toEmail, InvoiceDTO invoice) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@krumpi.ro");
        message.setTo(toEmail);
        message.setSubject("Order Confirmation #" + invoice.series() + invoice.number());

        StringBuilder body = new StringBuilder();
        body.append("Hello ").append(invoice.clientName()).append(",\n\n");
        body.append("Thank you for your order! Payment has been confirmed.\n\n");
        body.append("Invoice Details:\n");
        body.append("Series/No: ").append(invoice.series()).append(invoice.number()).append("\n");
        body.append("Total: ").append(invoice.totalGross()).append(" RON\n\n");
        body.append("Products:\n");

        for (InvoiceItemDTO item : invoice.items()) {
            body.append("- ").append(item.productName())
                    .append(" x ").append(item.quantity())
                    .append(" (").append(item.totalValue()).append(" RON)\n");
        }

        body.append("The Krumpi Management Team");

        message.setText(body.toString());

        try {
            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
}