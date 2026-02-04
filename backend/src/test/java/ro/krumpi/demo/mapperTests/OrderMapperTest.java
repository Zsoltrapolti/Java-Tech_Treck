package ro.krumpi.demo.mapperTests;

import org.junit.jupiter.api.Test;
import ro.krumpi.demo.dto.orders_sapior.OrderDTO;
import ro.krumpi.demo.mapper.OrderMapper;
import ro.krumpi.demo.model.order.Order;
import ro.krumpi.demo.model.employee.Employee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class OrderMapperTest {

    @Test
    void testToOrderDTO_BasicMapping() {

        Order order = new Order();
        order.setId(100L);
        order.setCustomerName("John Doe");

        Employee emp = new Employee();
        emp.setId(5L);
        order.setResponsibleEmployee(emp);


        OrderDTO dto = OrderMapper.toOrderDTO(order);


        assertNotNull(dto);
        assertEquals(100L, dto.getId());
        assertEquals("John Doe", dto.getCustomerName());
        assertEquals(5L, dto.getResponsibleEmployeeId());
    }
}