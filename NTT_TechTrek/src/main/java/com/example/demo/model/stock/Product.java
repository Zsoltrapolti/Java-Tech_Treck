package com.example.demo.model.stock;
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

    public Product(Long l, String product1, String type1, String unit1) {
    }
}
