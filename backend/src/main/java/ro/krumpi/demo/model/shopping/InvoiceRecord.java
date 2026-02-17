package ro.krumpi.demo.model.shopping;

import jakarta.persistence.*;
import lombok.*;
import ro.krumpi.demo.model.auth.UserAccount;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String seriesNumber;

    private LocalDateTime issuedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserAccount buyer;

    private Double totalNet;
    private Double totalVat;
    private Double totalGross;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @OneToMany(mappedBy = "invoiceRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceLine> lines = new ArrayList<>();

    private String clientName;
    private String clientAddress;
    private String clientCity;
    private String clientCounty;
    private String clientZip;
}