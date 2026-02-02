package ro.krumpi.demo.model.shopping;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invoice_record_id")
    private InvoiceRecord invoiceRecord;

    private String productName;
    private String unitOfMeasure;
    private Double pricePerUnit;
    private Integer quantity;
    private Double lineTotalValue;
}