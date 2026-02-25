package ro.krumpi.demo.dto;



import org.junit.jupiter.api.Test;
import ro.krumpi.demo.dto.orders_sapior.OrderDTO;
import ro.krumpi.demo.dto.orders_sapior.OrderItemDTO;

import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

class DtoTest {

    @Test
    void testOrderDTO() {
        OrderDTO dto = new OrderDTO();
        dto.setId(1L);
        dto.setCustomerName("Teszt");
        dto.setResponsibleEmployeeId(2L);
        dto.setItems(new ArrayList<>());

        assertEquals(1L, dto.getId());
        assertEquals("Teszt", dto.getCustomerName());
        assertNotNull(dto.getItems());
    }

    @Test
    void testOrderItemDTO() {
        OrderItemDTO item = new OrderItemDTO(1L, 10.0, 5.0);
        assertEquals(1L, item.getProductId());
        assertEquals(10.0, item.getQuantity());
        assertEquals(5.0, item.getUnitPrice());
    }
}
