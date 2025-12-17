package ro.krumpi.demo.model.order;
import com.fasterxml.jackson.annotation.JsonIgnore;
import ro.krumpi.demo.model.stock.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JsonIgnore
    private Order order;

    @ManyToOne(optional = false)
    private Product product;

    private Double quantity;
    private Double unitPrice;
}
