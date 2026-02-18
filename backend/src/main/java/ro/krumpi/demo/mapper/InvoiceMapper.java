package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.InvoiceItemDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceLine;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.model.stock.CartItem;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class InvoiceMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    public static InvoiceDTO toDTO(InvoiceRecord invoice) {
        List<InvoiceItemDTO> items = invoice.getLines().stream()
                .map(InvoiceMapper::toItemDTO)
                .collect(Collectors.toList());

        return new InvoiceDTO(
                invoice.getId(),
                "KR",
                invoice.getSeriesNumber(),
                invoice.getIssuedAt().format(FORMATTER),
                "KRUMPI MANAGEMENT SRL",
                "RO12345678",
                "J40/123/2023",
                "Str. Cartofului Nr. 1, Brașov",
                "Banca Transilvania",
                "RO99BTRL00000000000000XX",
                invoice.getBuyer().getUsername(),
                "Adresa Client (UserAccount)",
                items,
                invoice.getTotalNet(),
                invoice.getTotalVat(),
                invoice.getTotalGross()
        );
    }

    private static InvoiceItemDTO toItemDTO(InvoiceLine line) {
        return new InvoiceItemDTO(
                line.getId(),
                line.getProductName(),
                line.getUnitOfMeasure(),
                line.getQuantity(),
                line.getPricePerUnit(),
                line.getLineTotalValue()
        );
    }

    public static InvoiceRecord createInvoiceEntity(UserAccount user, List<CartItem> cartItems) {
        InvoiceRecord invoice = new InvoiceRecord();
        invoice.setSeriesNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoice.setIssuedAt(java.time.LocalDateTime.now());
        invoice.setBuyer(user);
        invoice.setStatus(PaymentStatus.PENDING_PAYMENT);

        double totalNet = 0;
        List<InvoiceLine> lines = new java.util.ArrayList<>();

        for (CartItem item : cartItems) {
            InvoiceLine line = new InvoiceLine();
            line.setInvoiceRecord(invoice);
            line.setProductName(item.getProduct().getName());
            line.setUnitOfMeasure(item.getProduct().getUnitOfMeasure());
            line.setPricePerUnit(item.getProduct().getPrice());
            line.setQuantity(item.getQuantity());

            double lineTotal = item.getProduct().getPrice() * item.getQuantity();
            line.setLineTotalValue(lineTotal);

            totalNet += lineTotal;
            lines.add(line);
        }

        invoice.setLines(lines);
        invoice.setTotalNet(totalNet);
        invoice.setTotalVat(totalNet * 0.19);
        invoice.setTotalGross(totalNet * 1.19);

        return invoice;
    }
}