package ro.krumpi.demo.dto.shopping;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ro.krumpi.demo.model.shopping.PaymentMethod;

@Data
public class PaymentRequest {
    @NotNull
    private Long invoiceId;

    @NotNull
    private PaymentMethod paymentMethod;
}