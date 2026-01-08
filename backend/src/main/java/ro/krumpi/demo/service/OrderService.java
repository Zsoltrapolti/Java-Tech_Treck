package ro.krumpi.demo.service;

import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.model.order.OrderItem;
import ro.krumpi.demo.model.order.OrderStatus;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.repository.EmployeeRepository;
import ro.krumpi.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;
import ro.krumpi.demo.repository.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final DistributorClient distributorClient;

    public OrderService(OrderRepository orderRepository, DistributorClient distributorClient) {
        this.orderRepository = orderRepository;
        this.distributorClient = distributorClient;
    }

    // CREATE
    public Order addOrder(Order order) {
        order.setCreationDate(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);

        order.getItems().forEach(i -> i.setOrder(order));

        Order saved = orderRepository.save(order);

        distributorClient.sendOrderToDistributor(saved);

        saved.setStatus(OrderStatus.SENT);
        return orderRepository.save(saved);
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

    // MARK AS DELIVERED
    @Transactional
    public void markDelivered(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.DELIVERED);

        for (OrderItem item : order.getItems()) {
            Product p = item.getProduct();
            p.setQuantity(p.getQuantity() + item.getQuantity());
        }
    }

    // MARK AS CONFIRMED
    @Transactional
    public void markConfirmed(Long id) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(OrderStatus.CONFIRMED);
    }

    // CANCEL ORDER
    @Transactional
    public void cancel(Long id) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(OrderStatus.CANCELLED);
    }

}
