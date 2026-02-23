package ro.krumpi.demo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    public void sendPaymentReminder(String to, String clientName, String invoiceSeries, Double amount, String dueDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Payment Reminder - Invoice " + invoiceSeries);

            String body = "<h3>Dear " + clientName + ",</h3>" +
                    "<p>We hope this message finds you well.</p>" +
                    "<p>This is a friendly reminder that invoice <b>" + invoiceSeries + "</b> in the amount of <b>" + String.format("%.2f", amount) + " RON</b> " +
                    "was due on <b>" + dueDate + "</b> and is currently showing as unpaid.</p>" +
                    "<p>Please arrange for payment as soon as possible to avoid any late fees.</p>" +
                    "<br/>" +
                    "<p><i>If you have already made the payment within the last 24 hours, please disregard this automated message.</i></p>" +
                    "<br/>" +
                    "<p>Best regards,<br/>The Krumpi Management Team</p>";

            helper.setText(body, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Error sending payment reminder: " + e.getMessage());
        }
    }
}