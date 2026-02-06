package ro.krumpi.demo.model;

import org.junit.jupiter.api.Test;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.model.order.OrderStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

class OrderModelTest {

    @Test
    void testOrderGettersAndSetters() {
        Order order = new Order();
        LocalDateTime now = LocalDateTime.now();
        Employee emp = new Employee();
        emp.setId(1L);

        order.setId(10L);
        order.setCustomerName("Teszt Elek");
        order.setCreationDate(now);
        order.setStatus(OrderStatus.NEW);
        order.setResponsibleEmployee(emp);
        order.setItems(new ArrayList<>());

        assertEquals(10L, order.getId());
        assertEquals("Teszt Elek", order.getCustomerName());
        assertEquals(now, order.getCreationDate());
        assertEquals(OrderStatus.NEW, order.getStatus());
        assertEquals(emp, order.getResponsibleEmployee());
        assertNotNull(order.getItems());
    }
}