package ro.krumpi.demo.mapperTests;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.mapper.InvoiceMapper;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceLine;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.model.stock.CartItem;
import ro.krumpi.demo.model.stock.Product;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class InvoiceMapperTest {

    @Test
    @DisplayName("createInvoiceEntity: Math and VAT Calculation Coverage")
    void createInvoiceEntity_ShouldCalculateTotals() {
        // Arrange
        UserAccount user = new UserAccount();
        user.setId(1L);

        Product product = new Product();
        product.setName("Coffee");
        product.setPrice(10.0);
        product.setUnitOfMeasure("kg");

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(5);

        // Act
        InvoiceRecord result = InvoiceMapper.createInvoiceEntity(user, List.of(item));

        // Assert
        assertEquals(50.0, result.getTotalNet());   // 10 * 5
        assertEquals(9.5, result.getTotalVat());    // 50 * 0.19
        assertEquals(59.5, result.getTotalGross()); // 50 + 9.5
        assertEquals(PaymentStatus.PENDING_PAYMENT, result.getStatus());
        assertEquals(1, result.getLines().size());
        assertTrue(result.getSeriesNumber().startsWith("INV-"));
    }

    @Test
    @DisplayName("toDTO: Address formatting and fallback naming")
    void toDTO_Coverage() {
        // Arrange
        UserAccount user = new UserAccount();
        user.setUsername("krumpi_user");

        InvoiceRecord invoice = InvoiceRecord.builder()
                .id(99L)
                .seriesNumber("INV-12345678")
                .issuedAt(LocalDateTime.of(2026, 3, 3, 12, 0))
                .buyer(user)
                .status(PaymentStatus.PENDING_PAYMENT)
                .totalNet(100.0)
                .totalVat(19.0)
                .totalGross(119.0)
                .clientAddress("Main St 1")
                .clientCity("Cluj")
                .clientCounty("CJ")
                .clientZip("400001")
                .lines(new ArrayList<>()) // Builder won't init this automatically without @Builder.Default
                .build();

        // Act
        InvoiceDTO dto = InvoiceMapper.toDTO(invoice);

        // Assert
        assertEquals("INV", dto.series());
        assertEquals("12345678", dto.number());
        assertEquals("krumpi_user", dto.clientName()); // Tests fallback to username
        assertTrue(dto.clientAddress().contains("Main St 1, Cluj, CJ, 400001"));
        assertEquals(119.0, dto.totalGross());
    }

    @Test
    @DisplayName("toDTO: Branch coverage for null client data")
    void toDTO_NullBranchCoverage() {
        // Test 1: Null Address branch
        InvoiceRecord invNoAddress = InvoiceRecord.builder()
                .seriesNumber("INV-00000000")
                .issuedAt(LocalDateTime.now())
                .status(PaymentStatus.PENDING_PAYMENT)
                .clientAddress(null)
                .lines(new ArrayList<>())
                // FIX: Must add these to prevent NPE during unboxing to primitive double
                .totalNet(0.0)
                .totalVat(0.0)
                .totalGross(0.0)
                .build();

        // Test 2: Unknown Client branch (Buyer is null, ClientName is null)
        InvoiceRecord invUnknown = InvoiceRecord.builder()
                .seriesNumber("INV-11111111")
                .issuedAt(LocalDateTime.now())
                .status(PaymentStatus.PENDING_PAYMENT)
                .clientName(null)
                .buyer(null)
                .lines(new ArrayList<>())
                // FIX: Must add these to prevent NPE
                .totalNet(0.0)
                .totalVat(0.0)
                .totalGross(0.0)
                .build();

        InvoiceDTO dto1 = InvoiceMapper.toDTO(invNoAddress);
        InvoiceDTO dto2 = InvoiceMapper.toDTO(invUnknown);

        assertEquals("Address not provided", dto1.clientAddress());
        assertEquals("Unknown Client", dto2.clientName());
    }
}