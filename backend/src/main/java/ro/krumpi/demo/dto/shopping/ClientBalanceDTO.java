package ro.krumpi.demo.dto.shopping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientBalanceDTO {
    private Long clientId;
    private String clientUsername;
    private Double totalInvoiced;
    private Double totalPaid;
    private Double totalPending;
    private List<OrderSummaryDTO> invoices;
}
