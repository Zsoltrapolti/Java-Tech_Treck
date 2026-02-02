package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.stock.ProductDTO;
import ro.krumpi.demo.model.stock.Product;

public class ProductMapper {

    public static Product toEntity(ProductDTO dto) {
        Product p = new Product();
        p.setName(dto.getName());
        p.setType(dto.getType());
        p.setUnitOfMeasure(dto.getUnitOfMeasure());
        p.setQuantity(dto.getQuantity());
        p.setPrice(dto.getPrice());
        return p;
    }

    public static ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getType(),
                product.getUnitOfMeasure(),
                product.getQuantity(),
                product.getPrice()
        );
    }
}
