package com.example.demo.service;

import com.example.demo.model.order.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // CREATE
    public Order addOrder(Order order) {
        order.setCreationDate(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // READ all
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // READ by ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // UPDATE
    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        existing.setCustomerName(updatedOrder.getCustomerName());
        existing.setStatus(updatedOrder.getStatus());
        existing.setResponsibleEmployee(updatedOrder.getResponsibleEmployee());

        return orderRepository.save(existing);
    }

    // DELETE
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
