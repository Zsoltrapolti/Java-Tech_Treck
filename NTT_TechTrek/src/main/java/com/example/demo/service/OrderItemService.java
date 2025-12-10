package com.example.demo.service;

import com.example.demo.model.order.Order;
import com.example.demo.model.order.OrderItem;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;

    public OrderItemService(OrderItemRepository orderItemRepository,
                            OrderRepository orderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
    }

    // CREATE
    public OrderItem addOrderItem(Long orderId, OrderItem orderItem) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderItem.setOrder(order);
        return orderItemRepository.save(orderItem);
    }

    // READ all
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // READ by ID
    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));
    }

    // READ by Order
    public List<OrderItem> getOrderItemsByOrder(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    // UPDATE
    public OrderItem updateOrderItem(Long id, OrderItem updatedItem) {
        OrderItem existing = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        existing.setProduct(updatedItem.getProduct());
        existing.setQuantity(updatedItem.getQuantity());
        existing.setUnitPrice(updatedItem.getUnitPrice());

        return orderItemRepository.save(existing);
    }

    // DELETE
    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }
}
