package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.InvoiceItemDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceLine;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.model.stock.CartItem;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class InvoiceMapper {

    private static final String FURNIZOR_NUME = "SC KRUMPI MANAGEMENT SRL";
    private static final String FURNIZOR_CUI = "RO12345678";
    private static final String FURNIZOR_REG = "J12/1234/2024";
    private static final String FURNIZOR_ADRESA = "Str. Cartofilor Nr. 1, Cluj-Napoca";
    private static final String FURNIZOR_BANCA = "Banca Transilvania";
    private static final String FURNIZOR_IBAN = "RO99 BTRL 0000 0000 0000 00XX";

    public static InvoiceDTO toDTO(InvoiceRecord inv) {

        List<InvoiceItemDTO> items = inv.getLines().stream()
                .map(line -> new InvoiceItemDTO(
                        line.getProductName(),
                        line.getUnitOfMeasure(),
                        line.getQuantity(),
                        line.getPricePerUnit(),
                        line.getLineTotalValue()
                )).toList();

        return new InvoiceDTO(
                inv.getSeriesNumber(),
                String.valueOf(inv.getId()),
                inv.getIssuedAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
                FURNIZOR_NUME,
                FURNIZOR_CUI,
                FURNIZOR_REG,
                FURNIZOR_ADRESA,
                FURNIZOR_BANCA,
                FURNIZOR_IBAN,
                inv.getBuyer().getUsername(),
                "Romania",
                items,
                inv.getTotalNet(),
                inv.getTotalVat(),
                inv.getTotalGross()
        );
    }

    public static InvoiceRecord createInvoiceEntity(UserAccount buyer, List<CartItem> cartItems) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cannot create invoice from empty cart");
        }
        InvoiceRecord invoice = InvoiceRecord.builder()
                .seriesNumber("INV-" + System.currentTimeMillis())
                .issuedAt(LocalDateTime.now())
                .buyer(buyer)
                .status(PaymentStatus.PENDING_PAYMENT)
                .lines(new ArrayList<>())
                .build();

        double totalNet = 0.0;
        for (CartItem item : cartItems) {
            double price = (item.getProduct().getPrice() != null) ? item.getProduct().getPrice() : 0.0;
            double lineVal = price * item.getQuantity();

            InvoiceLine line = createInvoiceLine(invoice, item, price, lineVal);

            invoice.getLines().add(line);
            totalNet += lineVal;
        }

        invoice.setTotalNet(totalNet);
        invoice.setTotalVat(totalNet * 0.19);
        invoice.setTotalGross(totalNet * 1.19);

        return invoice;
    }

    private static InvoiceLine createInvoiceLine(InvoiceRecord parentInvoice, CartItem item, double price, double lineVal) {
        return InvoiceLine.builder()
                .invoiceRecord(parentInvoice)
                .productName(item.getProduct().getName())
                .unitOfMeasure(item.getProduct().getUnitOfMeasure())
                .quantity(item.getQuantity())
                .pricePerUnit(price)
                .lineTotalValue(lineVal)
                .build();
    }
}