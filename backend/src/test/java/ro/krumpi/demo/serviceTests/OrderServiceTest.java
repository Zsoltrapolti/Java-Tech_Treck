package ro.krumpi.demo.serviceTests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.model.order.OrderStatus;
import ro.krumpi.demo.repository.OrderRepository;
import ro.krumpi.demo.service.OrderService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void testCancelOrder_ShouldUpdateStatus() {
        // Arrange
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.NEW);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        orderService.cancel(1L);

        // Assert
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
    }
}