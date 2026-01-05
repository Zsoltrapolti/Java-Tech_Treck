package ro.krumpi.demo.model.employee;

import jakarta.persistence.*;
import lombok.*;
import ro.krumpi.demo.model.auth.UserAccount;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String role;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private UserAccount user;


}
