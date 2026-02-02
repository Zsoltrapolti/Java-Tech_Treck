package ro.krumpi.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.krumpi.demo.model.stock.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}