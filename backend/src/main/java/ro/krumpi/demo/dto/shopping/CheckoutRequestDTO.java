package ro.krumpi.demo.dto.shopping;

import lombok.Data;

@Data
public class CheckoutRequestDTO {
    private String street;
    private String city;
    private String county;
    private String zip;
    private String cardHolderName;
}