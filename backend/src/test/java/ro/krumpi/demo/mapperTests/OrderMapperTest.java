package ro.krumpi.demo.mapperTests;



import org.junit.jupiter.api.Test;
import ro.krumpi.demo.dto.orders_sapior.OrderDTO;
import ro.krumpi.demo.dto.orders_sapior.OrderItemDTO;
import ro.krumpi.demo.mapper.OrderMapper;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.model.order.OrderItem;
import ro.krumpi.demo.model.stock.Product;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class OrderMapperTest {

    @Test
    void toOrderDTO_ShouldMapAllFields() {
        // Arrange
        Employee emp = new Employee();
        emp.setId(10L);

        Product p = new Product();
        p.setId(100L);

        Order order = new Order();
        order.setId(1L);
        order.setCustomerName("Teszt Vásárló");
        order.setResponsibleEmployee(emp);

        OrderItem item = new OrderItem();
        item.setProduct(p);
        item.setQuantity(2.0);
        item.setUnitPrice(50.0);
        order.setItems(List.of(item));

        // Act
        OrderDTO dto = OrderMapper.toOrderDTO(order);

        // Assert
        assertEquals("Teszt Vásárló", dto.getCustomerName());
        assertEquals(10L, dto.getResponsibleEmployeeId());
        assertEquals(1, dto.getItems().size());
        assertEquals(100L, dto.getItems().get(0).getProductId());
    }

    @Test
    void toOrderEntity_ShouldMapDtoToEntity() {
        // Arrange
        OrderDTO dto = new OrderDTO();
        dto.setCustomerName("Új Rendelés");

        OrderItemDTO itemDto = new OrderItemDTO(200L, 5.0, 10.0);
        dto.setItems(List.of(itemDto));

        Employee emp = new Employee();
        emp.setId(10L);

        Product mockProduct = new Product();
        mockProduct.setId(200L);

        // Act
        Order entity = OrderMapper.toOrderEntity(dto, emp, (id) -> mockProduct);

        // Assert
        assertEquals("Új Rendelés", entity.getCustomerName());
        assertEquals(emp, entity.getResponsibleEmployee());
        assertEquals(1, entity.getItems().size());
        assertEquals(mockProduct, entity.getItems().get(0).getProduct());
    }
}