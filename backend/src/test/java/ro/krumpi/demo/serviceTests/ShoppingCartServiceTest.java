package ro.krumpi.demo.serviceTests
;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.dto.shopping.AddToCartRequest;
import ro.krumpi.demo.dto.stock.ShoppingCartDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.stock.CartItem;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.model.stock.ShoppingCart;
import ro.krumpi.demo.repository.ProductRepository;
import ro.krumpi.demo.repository.ShoppingCartRepository;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.service.ShoppingCartService;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShoppingCartServiceTest {

    @Mock private ShoppingCartRepository cartRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserAccountRepository userRepository;

    @InjectMocks
    private ShoppingCartService shoppingCartService;

    private UserAccount user;
    private ShoppingCart cart;
    private Product product;
    private final String USERNAME = "test@user.com";

    @BeforeEach
    void setUp() {
        user = new UserAccount();
        user.setUsername(USERNAME);

        // Initializing with ArrayList to avoid NPEs since @Builder might ignore defaults
        cart = ShoppingCart.builder()
                .id(1L)
                .user(user)
                .items(new ArrayList<>())
                .build();

        product = new Product();
        product.setId(10L);
        product.setName("Laptop");
        product.setPrice(1000.0);
        product.setQuantity(10.0); // 10 in stock
    }

    @Test
    @DisplayName("addItemToCart: Success - New item added to cart")
    void addItemToCart_NewItem_Success() {
        // Arrange
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(10L);
        request.setQuantity(2);

        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        ShoppingCartDTO result = shoppingCartService.addItemToCart(USERNAME, request);

        // Assert
        assertNotNull(result);
        assertEquals(1, cart.getItems().size());
        verify(cartRepository).save(any(ShoppingCart.class));
    }

    @Test
    @DisplayName("addItemToCart: Success - Increment existing item quantity")
    void addItemToCart_ExistingItem_Increments() {
        // Arrange
        CartItem existingItem = new CartItem();
        existingItem.setProduct(product);
        existingItem.setQuantity(1);
        cart.getItems().add(existingItem);

        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(10L);
        request.setQuantity(2);

        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(ShoppingCart.class))).thenReturn(cart);

        // Act
        shoppingCartService.addItemToCart(USERNAME, request);

        // Assert
        assertEquals(3, existingItem.getQuantity(), "1 existing + 2 new = 3");
    }

    @Test
    @DisplayName("addItemToCart: Fail - Insufficient stock")
    void addItemToCart_InsufficientStock_ThrowsException() {
        // Arrange
        product.setQuantity(1.0); // Only 1 in stock
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(10L);
        request.setQuantity(5); // Trying to add 5

        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> shoppingCartService.addItemToCart(USERNAME, request));

        assertTrue(exception.getMessage().contains("Insufficient stock"));
    }

    @Test
    @DisplayName("removeItemFromCart: Success")
    void removeItemFromCart_Success() {
        // Arrange
        CartItem item = new CartItem();
        item.setId(50L);
        cart.getItems().add(item);

        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        // Act
        shoppingCartService.removeItemFromCart(USERNAME, 50L);

        // Assert
        assertTrue(cart.getItems().isEmpty());
        verify(cartRepository).save(cart);
    }

    @Test
    @DisplayName("getUserCart: Should create cart if user exists but has no cart")
    void getUserCart_CreatesNewCart_WhenMissing() {
        // Arrange
        when(userRepository.findByUsername(USERNAME)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.empty());
        // Mock save to return whatever is passed to it
        when(cartRepository.save(any(ShoppingCart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ShoppingCartDTO result = shoppingCartService.getUserCart(USERNAME);

        // Assert
        assertNotNull(result);
        verify(cartRepository, atLeastOnce()).save(any(ShoppingCart.class));
    }
}