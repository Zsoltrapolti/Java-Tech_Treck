package ro.krumpi.demo.dto.shopping;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentDTO {
    private Long id;
    private Long invoiceId;
    private Double amount;
    private String method;
    private String status;
    private String transactionId;
    private LocalDateTime date;
}