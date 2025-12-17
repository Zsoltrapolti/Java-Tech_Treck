package ro.krumpi.demo.service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.krumpi.demo.model.order.Order;


@Service
public class DistributorClient {
    private final RestTemplate template = new RestTemplate();

    private final String distributorApiUrl = "https://firma-x/api/orders";

    public void sendOrderToDistributor(Order order) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("distributorUser", "distributorPassword");
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Order> request = new HttpEntity<>(order, headers);

        template.postForEntity(distributorApiUrl, request, Void.class);
    }
}