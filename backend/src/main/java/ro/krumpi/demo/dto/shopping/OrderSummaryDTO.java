package ro.krumpi.demo.dto.shopping;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderSummaryDTO {
    private Long orderId;
    private String description;
    private Double totalToPay;
    private String status;
}