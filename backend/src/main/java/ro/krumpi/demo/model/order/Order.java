package ro.krumpi.demo.model.order;
import ro.krumpi.demo.model.employee.Employee;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private LocalDateTime creationDate;
    private String status;

    @ManyToOne
    private Employee responsibleEmployee;
}
