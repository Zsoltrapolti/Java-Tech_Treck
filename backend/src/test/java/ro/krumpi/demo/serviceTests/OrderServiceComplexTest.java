package ro.krumpi.demo.serviceTests;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.model.order.OrderItem;
import ro.krumpi.demo.model.order.OrderStatus;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.repository.OrderRepository;
import ro.krumpi.demo.service.OrderService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceComplexTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void testAddOrder_ShouldSetItemsAndStatus() {
        // Arrange
        Order order = new Order();
        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem());
        order.setItems(items);

        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Act
        Order result = orderService.addOrder(order);

        // Assert
        assertEquals(OrderStatus.SENT, result.getStatus());
        assertNotNull(order.getCreationDate());
        assertEquals(order, order.getItems().get(0).getOrder());
    }

    @Test
    void testMarkDelivered_ShouldIncreaseProductQuantity() {
        // Arrange
        Product p = new Product();
        p.setQuantity(10.0);

        OrderItem item = new OrderItem();
        item.setProduct(p);
        item.setQuantity(5.0);

        Order order = new Order();
        order.setItems(List.of(item));

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        orderService.markDelivered(1L);

        // Assert
        assertEquals(OrderStatus.DELIVERED, order.getStatus());
        assertEquals(15.0, p.getQuantity()); // 10 + 5 = 15
    }
}
