package ro.krumpi.demo.dto.stock;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String unitOfMeasure;
    private Double pricePerUnit;
    private Integer quantity;
    private Double totalLinePrice;
}