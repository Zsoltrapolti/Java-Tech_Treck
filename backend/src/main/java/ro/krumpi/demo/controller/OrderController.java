package ro.krumpi.demo.controller;

import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @Operation(
            summary = "Create a new order",
            description = "Adds a new order to the system"
    )
    @PostMapping
    public Order addOrder(@RequestBody Order order) {
        return orderService.addOrder(order);
    }

    @Operation(
            summary = "Get all orders",
            description = "Returns a list of all orders"
    )
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @Operation(
            summary = "Get order by ID",
            description = "Returns the order that matches the given ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);

        if (order.isPresent()) {
            return ResponseEntity.ok(order.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
            summary = "Update order",
            description = "Updates the order with the given ID"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id,
                                             @RequestBody Order updatedOrder) {
        try {
            Order order = orderService.updateOrder(id, updatedOrder);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
            summary = "Delete order",
            description = "Deletes the order with the given ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Mark order as delivered",
            description = "Marks the order with the given ID as delivered"
    )
    @PostMapping("/{id}/deliver")
    public ResponseEntity<Void> markOrderAsDelivered(@PathVariable Long id) {
        try {
            orderService.markDelivered(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
            summary = "Confirm order",
            description = "Marks the order with the given ID as confirmed"
    )
    @PostMapping("/{id}/confirm")
    public ResponseEntity<Void> confirm(@PathVariable Long id) {
        orderService.markConfirmed(id);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Cancel order",
            description = "Marks the order with the given ID as canceled"
    )
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        orderService.cancel(id);
        return ResponseEntity.ok().build();
    }

}
