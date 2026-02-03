package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.shopping.AddToCartRequest;
import ro.krumpi.demo.dto.stock.ShoppingCartDTO;
import ro.krumpi.demo.service.ShoppingCartService;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class ShoppingCartController {

    private final ShoppingCartService cartService;

    @Operation(
            summary = "Get my cart",
            description = "Returns the shopping cart of the authenticated user"
    )
    @GetMapping
    public ResponseEntity<ShoppingCartDTO> getMyCart(Principal principal) {
        return ResponseEntity.ok(cartService.getUserCart(principal.getName()));
    }

    @Operation(
            summary = "Add product to cart",
            description = "Adds a product to the authenticated user's shopping cart"
    )
    @PostMapping("/items")
    public ResponseEntity<ShoppingCartDTO> addToCart(@Valid @RequestBody AddToCartRequest request, Principal principal) {
        ShoppingCartDTO updatedCart = cartService.addItemToCart(principal.getName(), request);
        return ResponseEntity.ok(updatedCart);
    }

    @Operation(
            summary = "Remove product from cart",
            description = "Removes a product from the authenticated user's shopping cart"
    )
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId, Principal principal) {
        cartService.removeItemFromCart(principal.getName(), cartItemId);
        return ResponseEntity.ok().build();
    }
}