package ro.krumpi.demo.model;



import org.junit.jupiter.api.Test;
import ro.krumpi.demo.model.order.OrderStatus;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class OrderStatusTest {

    @Test
    void testEnumValues() {
        for (OrderStatus status : OrderStatus.values()) {
            assertNotNull(OrderStatus.valueOf(status.name()));
        }
    }
}
