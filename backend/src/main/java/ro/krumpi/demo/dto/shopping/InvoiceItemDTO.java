package ro.krumpi.demo.dto.shopping;

public record InvoiceItemDTO(
        Long id,
        String productName,
        String unitOfMeasure,
        int quantity,
        double pricePerUnit,
        double totalValue
) {}