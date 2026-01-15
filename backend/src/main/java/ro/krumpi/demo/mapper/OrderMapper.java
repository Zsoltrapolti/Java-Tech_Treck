package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.OrderDTO;
import ro.krumpi.demo.dto.OrderItemDTO;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.model.order.OrderItem;
import ro.krumpi.demo.model.order.OrderStatus;
import ro.krumpi.demo.model.stock.Product;

import java.util.function.Function;
import java.util.stream.Collectors;

public class OrderMapper {

    public static Order toOrderEntity(
            OrderDTO dto,
            Employee employee,
            Function<Long, Product> productResolver
    ) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setResponsibleEmployee(employee);

        order.setItems(
                dto.getItems().stream().map(itemDto -> {
                    OrderItem item = new OrderItem();
                    item.setProduct(productResolver.apply(itemDto.getProductId()));
                    item.setQuantity(itemDto.getQuantity());
                    item.setUnitPrice(itemDto.getUnitPrice());
                    item.setOrder(order);
                    return item;
                }).collect(Collectors.toList())
        );

        return order;
    }

    public static OrderDTO toOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setCustomerName(order.getCustomerName());
        dto.setId(order.getId());

        dto.setResponsibleEmployeeId(
                order.getResponsibleEmployee() != null
                        ? order.getResponsibleEmployee().getId()
                        : null
        );

        dto.setItems(
                order.getItems().stream()
                        .map(OrderMapper::toOrderItemDTO)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    private static OrderItemDTO toOrderItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setProductId(item.getProduct().getId());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        return dto;
    }

}

