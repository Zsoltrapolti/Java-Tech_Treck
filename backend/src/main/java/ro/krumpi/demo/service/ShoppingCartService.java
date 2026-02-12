package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.shopping.AddToCartRequest;
import ro.krumpi.demo.dto.stock.ShoppingCartDTO;
import ro.krumpi.demo.mapper.ShoppingCartMapper;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.stock.CartItem;
import ro.krumpi.demo.model.stock.ShoppingCart;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.repository.ProductRepository;
import ro.krumpi.demo.repository.ShoppingCartRepository;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final ShoppingCartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserAccountRepository userRepository;

    @Transactional
    public ShoppingCartDTO getUserCart(String username) {
        ShoppingCart cart = getOrCreateCartEntity(username);
        return ShoppingCartMapper.toDTO(cart);
    }

    @Transactional
    public ShoppingCartDTO addItemToCart(String username, AddToCartRequest request) {
        ShoppingCart cart = getOrCreateCartEntity(username);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock! Only " + product.getQuantity() + " units left.");
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();

            if (newQuantity > product.getQuantity()) {
                throw new RuntimeException("Cannot add that many products. Stock limit is " + product.getQuantity());
            }

            item.setQuantity(newQuantity);
        } else {
            CartItem newItem = ShoppingCartMapper.createCartItemEntity(cart, product, request.getQuantity());
            cart.getItems().add(newItem);
        }

        ShoppingCart savedCart = cartRepository.save(cart);
        return ShoppingCartMapper.toDTO(savedCart);
    }

    @Transactional
    public void removeItemFromCart(String username, Long cartItemId) {
        ShoppingCart cart = getOrCreateCartEntity(username);
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        cartRepository.save(cart);
    }

    private ShoppingCart getOrCreateCartEntity(String username) {
        UserAccount user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    ShoppingCart newCart = ShoppingCartMapper.createEmptyCart(user);
                    return cartRepository.save(newCart);
                });
    }
}