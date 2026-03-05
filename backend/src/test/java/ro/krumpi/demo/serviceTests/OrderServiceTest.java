package ro.krumpi.demo.serviceTests;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setCustomerName("John Doe");
        sampleOrder.setItems(new ArrayList<>());

        OrderItem item = new OrderItem();
        // FIX: Pass 2.0 instead of 2 to match the Double type
        item.setQuantity(2.0);

        Product p = new Product();
        // Ensure this also matches your Product's setQuantity type (Double or Integer?)
        p.setQuantity(10.0);

        item.setProduct(p);
        sampleOrder.getItems().add(item);
    }

    @Test
    @DisplayName("addOrder should set status to SENT and link items")
    void addOrder_Success() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        // Act
        Order result = orderService.addOrder(sampleOrder);

        // Assert
        assertEquals(OrderStatus.SENT, result.getStatus());
        assertNotNull(sampleOrder.getCreationDate());
        // Verify bidirectional link
        assertEquals(sampleOrder, sampleOrder.getItems().get(0).getOrder());
        // Verify repository was called twice as per your logic
        verify(orderRepository, times(2)).save(any(Order.class));
    }

    @Test
    @DisplayName("updateOrder should update basic fields")
    void updateOrder_Success() {
        // Arrange
        Order updatedInfo = new Order();
        updatedInfo.setCustomerName("Jane Doe");
        updatedInfo.setStatus(OrderStatus.CONFIRMED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        // Act
        Order result = orderService.updateOrder(1L, updatedInfo);

        // Assert
        assertEquals("Jane Doe", result.getCustomerName());
        assertEquals(OrderStatus.CONFIRMED, result.getStatus());
    }

    @Test
    @DisplayName("markDelivered should update status and restore stock")
    void markDelivered_Success() {
        // 1. Stub the repository to return the sample order when searched by ID 1
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        // 2. Capture the initial stock to verify the math later
        Double initialStock = sampleOrder.getItems().get(0).getProduct().getQuantity();

        // 3. Act
        orderService.markDelivered(1L);

        // 4. Assert
        assertEquals(OrderStatus.DELIVERED, sampleOrder.getStatus());

        // Logic: Initial (10.0) + Item Quantity (2.0) = 12.0
        Double expectedStock = initialStock + sampleOrder.getItems().get(0).getQuantity();
        assertEquals(expectedStock, sampleOrder.getItems().get(0).getProduct().getQuantity());
    }
    @Test
    @DisplayName("cancel should change status to CANCELLED")
    void cancel_Success() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        // Act
        orderService.cancel(1L);

        // Assert
        assertEquals(OrderStatus.CANCELLED, sampleOrder.getStatus());
    }

    @Test
    @DisplayName("deleteOrder should call repository delete")
    void deleteOrder_Success() {
        // Act
        orderService.deleteOrder(1L);

        // Assert
        verify(orderRepository).deleteById(1L);
    }
}