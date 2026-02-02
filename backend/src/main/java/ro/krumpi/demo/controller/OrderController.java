package ro.krumpi.demo.controller;

import jakarta.validation.Valid;
import ro.krumpi.demo.dto.orders_sapior.OrderDTO;
import ro.krumpi.demo.mapper.OrderMapper;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.service.EmployeeService;
import ro.krumpi.demo.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import ro.krumpi.demo.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final EmployeeService employeeService;
    private final ProductService productService;

    public OrderController(OrderService orderService, EmployeeService employeeService, ProductService productService) {
        this.orderService = orderService;
        this.employeeService = employeeService;
        this.productService = productService;
    }

    @Operation(
            summary = "Create a new order",
            description = "Adds a new order to the system"
    )
    @PostMapping
    public OrderDTO addOrder(@Valid @RequestBody OrderDTO orderdto) {

        Employee employee = employeeService
                .getEmployeeById(orderdto.getResponsibleEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Order saved = orderService.addOrder(
                OrderMapper.toOrderEntity(
                        orderdto,
                        employee,
                        productService::getProductById
                )
        );

        return OrderMapper.toOrderDTO(saved);
    }

    @Operation(
            summary = "Get all orders",
            description = "Returns a list of all orders"
    )
    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders()
                .stream()
                .map(OrderMapper::toOrderDTO)
                .toList();
    }

    @Operation(
            summary = "Get order by ID",
            description = "Returns the order that matches the given ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(OrderMapper::toOrderDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Update order",
            description = "Updates the order with the given ID"
    )
    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id,
                                                @Valid @RequestBody OrderDTO updatedOrder) {
        Employee employee = employeeService
                .getEmployeeById(updatedOrder.getResponsibleEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Order updated = orderService.updateOrder(
                id,
                OrderMapper.toOrderEntity(
                        updatedOrder,
                        employee,
                        productService::getProductById
                )
        );

        return ResponseEntity.ok(OrderMapper.toOrderDTO(updated));
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
