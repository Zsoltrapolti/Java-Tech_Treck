package ro.krumpi.demo.dto.shopping;
import lombok.Builder;
import java.util.List;

@Builder
public record InvoiceDTO(
        Long id,
        String series,
        String number,
        String date,
        String supplierName,
        String supplierCui,
        String supplierReg,
        String supplierAddress,
        String supplierBank,
        String supplierIban,
        String clientName,
        String clientAddress,
        List<InvoiceItemDTO> items,
        double totalNet,
        double totalVat,
        double totalGross,
        String status
) {}