package ro.krumpi.demo.model.stock;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String unitOfMeasure;
    private Double quantity;
    private Double price;

    public Product(long l, String product1, String type1, String unit1, double v) {
    }
    public Product(long l, String product1, String type1, String unit1, double q, double p) {
        this.id = l;
        this.name = product1;
        this.type = type1;
        this.unitOfMeasure = unit1;
        this.quantity = q;
        this.price = p;
    }
}
