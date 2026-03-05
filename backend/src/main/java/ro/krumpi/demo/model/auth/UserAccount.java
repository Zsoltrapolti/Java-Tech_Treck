package ro.krumpi.demo.model.auth;

import jakarta.persistence.*;
import lombok.*;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.stock.Product;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "managed_by_employee_id")
    private UserAccount  managedBy;
}
