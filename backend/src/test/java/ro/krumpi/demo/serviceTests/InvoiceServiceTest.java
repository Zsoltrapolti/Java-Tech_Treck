package ro.krumpi.demo.serviceTests;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.dto.shopping.CheckoutRequestDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.model.stock.CartItem;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.model.stock.ShoppingCart;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.repository.ShoppingCartRepository;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.service.InvoiceService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock private ShoppingCartRepository cartRepository;
    @Mock private InvoiceRecordRepository invoiceRepository;
    @Mock private UserAccountRepository userRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    private UserAccount user;
    private ShoppingCart cart;
    private CheckoutRequestDTO checkoutDTO;
    private final String USERNAME = "buyer@test.ro";

    @BeforeEach
    void setUp() {
        user = new UserAccount();
        user.setUsername(USERNAME);

        Product product = new Product();
        product.setName("Widget");
        product.setPrice(10.0);

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(2);

        cart = ShoppingCart.builder()
                .user(user)
                .items(new ArrayList<>(List.of(item)))
                .build();

        checkoutDTO = new CheckoutRequestDTO();
        checkoutDTO.setCardHolderName("John Doe");
        checkoutDTO.setStreet("Main St 123");
        checkoutDTO.setCity("Cluj-Napoca");
        checkoutDTO.setCounty("Cluj");
        checkoutDTO.setZip("400123");
    }

    @Test
    @DisplayName("checkout: Success - Should save invoice and clear cart")
    void checkout_Success() {
        // Arrange
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        // Mock save to return the same invoice passed to it
        when(invoiceRepository.save(any(InvoiceRecord.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        InvoiceRecord result = invoiceService.checkout(USERNAME, checkoutDTO);

        // Assert
        assertNotNull(result);
        assertEquals("John Doe", result.getClientName());
        assertEquals("Main St 123", result.getClientAddress());

        // Verify cart logic
        assertTrue(cart.getItems().isEmpty(), "Cart items should be cleared after checkout");
        verify(invoiceRepository).save(any(InvoiceRecord.class));
        verify(cartRepository).save(cart);
    }

    @Test
    @DisplayName("checkout: Fail - Empty cart should throw exception")
    void checkout_EmptyCart_ThrowsException() {
        // Arrange
        cart.setItems(new ArrayList<>()); // Make cart empty
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> invoiceService.checkout(USERNAME, checkoutDTO));

        assertEquals("Cannot checkout empty cart", ex.getMessage());
        verify(invoiceRepository, never()).save(any());
    }

    @Test
    @DisplayName("getMyPendingInvoices: Should return only pending records")
    void getMyPendingInvoices_Success() {
        // Arrange
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(invoiceRepository.findByBuyerAndStatus(user, PaymentStatus.PENDING_PAYMENT))
                .thenReturn(List.of(new InvoiceRecord()));

        // Act
        List<InvoiceRecord> results = invoiceService.getMyPendingInvoices(USERNAME);

        // Assert
        assertFalse(results.isEmpty());
        verify(invoiceRepository).findByBuyerAndStatus(user, PaymentStatus.PENDING_PAYMENT);
    }
}
