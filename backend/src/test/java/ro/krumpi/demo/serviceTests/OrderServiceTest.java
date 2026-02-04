package ro.krumpi.demo.serviceTests;



import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
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
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setCustomerName("Teszt Elek");
        testOrder.setItems(new ArrayList<>());
    }

    @Test
    void addOrder_ShouldSetStatusAndSaveTwice() {
        // Arrange
        // A service kétszer hívja a mentést (NEW majd SENT státusszal)
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        Order savedOrder = orderService.addOrder(testOrder);

        // Assert
        assertNotNull(savedOrder);
        verify(orderRepository, times(2)).save(any(Order.class));
        assertEquals(OrderStatus.SENT, testOrder.getStatus());
    }

    @Test
    void markDelivered_ShouldUpdateStockAndStatus() {
        // Arrange
        Product p = new Product();
        p.setQuantity(10.0);

        OrderItem item = new OrderItem();
        item.setProduct(p);
        item.setQuantity(5.0);

        testOrder.getItems().add(item);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act
        orderService.markDelivered(1L);

        // Assert
        assertEquals(OrderStatus.DELIVERED, testOrder.getStatus());
        assertEquals(15.0, p.getQuantity()); // 10 + 5
    }

    @Test
    void cancel_ShouldSetStatusToCancelled() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        // Act
        orderService.cancel(1L);

        // Assert
        assertEquals(OrderStatus.CANCELLED, testOrder.getStatus());
    }
}
