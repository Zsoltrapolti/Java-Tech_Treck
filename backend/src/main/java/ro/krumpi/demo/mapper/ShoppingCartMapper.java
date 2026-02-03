package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.stock.CartItemDTO;
import ro.krumpi.demo.dto.stock.ShoppingCartDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.stock.CartItem;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.model.stock.ShoppingCart;

import java.util.ArrayList;
import java.util.List;

public class ShoppingCartMapper {

    public static ShoppingCartDTO toDTO(ShoppingCart cart) {
        double grandTotal = 0.0;
        List<CartItemDTO> itemDTOs = new ArrayList<>();

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                CartItemDTO itemDTO = toItemDTO(item);
                itemDTOs.add(itemDTO);
                grandTotal += itemDTO.getTotalLinePrice();
            }
        }

        return new ShoppingCartDTO(
                cart.getId(),
                itemDTOs,
                grandTotal
        );
    }

    private static CartItemDTO toItemDTO(CartItem item) {
        double price = (item.getProduct().getPrice() != null) ? item.getProduct().getPrice() : 0.0;
        double totalLine = price * item.getQuantity();

        return new CartItemDTO(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getUnitOfMeasure(),
                price,
                item.getQuantity(),
                totalLine
        );
    }

    public static CartItem createCartItemEntity(ShoppingCart cart, Product product, Integer quantity) {
        return CartItem.builder()
                .shoppingCart(cart)
                .product(product)
                .quantity(quantity)
                .build();
    }

    public static ShoppingCart createEmptyCart(UserAccount user) {
        ShoppingCart cart = new ShoppingCart();
        cart.setUser(user);
        cart.setItems(new ArrayList<>());
        return cart;
    }
}