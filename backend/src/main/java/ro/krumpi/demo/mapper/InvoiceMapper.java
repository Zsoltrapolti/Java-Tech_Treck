package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.InvoiceItemDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceLine;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.model.stock.CartItem;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class InvoiceMapper {

    public static InvoiceRecord createInvoiceEntity(UserAccount user, List<CartItem> cartItems) {
        double totalNet = 0.0;
        List<InvoiceLine> lines = new ArrayList<>();

        InvoiceRecord invoice = InvoiceRecord.builder()
                .seriesNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .issuedAt(LocalDateTime.now())
                .buyer(user)
                .status(PaymentStatus.PENDING_PAYMENT)
                .lines(lines)
                .build();

        for (CartItem item : cartItems) {
            double price = item.getProduct().getPrice() != null ? item.getProduct().getPrice() : 0.0;
            double lineTotal = price * item.getQuantity();
            totalNet += lineTotal;

            InvoiceLine line = InvoiceLine.builder()
                    .invoiceRecord(invoice)
                    .productName(item.getProduct().getName())
                    .unitOfMeasure(item.getProduct().getUnitOfMeasure())
                    .pricePerUnit(price)
                    .quantity(item.getQuantity())
                    .lineTotalValue(lineTotal)
                    .build();
            lines.add(line);
        }

        double vatRate = 0.19;
        double totalVat = totalNet * vatRate;
        double totalGross = totalNet + totalVat;

        invoice.setTotalNet(totalNet);
        invoice.setTotalVat(totalVat);
        invoice.setTotalGross(totalGross);

        return invoice;
    }

    public static InvoiceDTO toDTO(InvoiceRecord invoice) {
        List<InvoiceItemDTO> items = invoice.getLines().stream()
                .map(line -> new InvoiceItemDTO(
                        line.getId(),
                        line.getProductName(),
                        line.getUnitOfMeasure(),
                        line.getQuantity(),
                        line.getPricePerUnit(),
                        line.getLineTotalValue()
                ))
                .collect(Collectors.toList());

        String fullAddress = String.format("%s, %s, %s, %s",
                invoice.getClientAddress(),
                invoice.getClientCity(),
                invoice.getClientCounty(),
                invoice.getClientZip()
        );

        String displayName = invoice.getClientName() != null ? invoice.getClientName() :
                (invoice.getBuyer() != null ? invoice.getBuyer().getUsername() : "Unknown Client");

        if (invoice.getClientAddress() == null) fullAddress = "Address not provided";


        return InvoiceDTO.builder()
                .id(invoice.getId())
                .series(invoice.getSeriesNumber().substring(0, 3))
                .number(invoice.getSeriesNumber().substring(4))
                .date(invoice.getIssuedAt().toString())
                .supplierName("Krumpi Management SRL")
                .supplierCui("RO12345678")
                .supplierReg("J40/1234/2020")
                .supplierAddress("Str. Principala nr. 1, Bucuresti")
                .supplierBank("Banca Transilvania")
                .supplierIban("RO99BTRL00000000000000XX")
                .clientName(displayName)
                .clientAddress(fullAddress)
                .items(items)
                .totalNet(invoice.getTotalNet())
                .totalVat(invoice.getTotalVat())
                .totalGross(invoice.getTotalGross())
                .status(invoice.getStatus().name())
                .build();
    }
}