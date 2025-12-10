package com.example.demo.repository;

import com.example.demo.model.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Optional: find items by order ID
    List<OrderItem> findByOrderId(Long orderId);
}

