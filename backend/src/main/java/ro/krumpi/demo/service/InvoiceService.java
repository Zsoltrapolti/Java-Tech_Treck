package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.shopping.CheckoutRequestDTO;
import ro.krumpi.demo.mapper.InvoiceMapper;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.stock.CartItem;
import ro.krumpi.demo.model.stock.ShoppingCart;
import ro.krumpi.demo.model.shopping.InvoiceLine;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.repository.ShoppingCartRepository;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final ShoppingCartRepository cartRepository;
    private final InvoiceRecordRepository invoiceRepository;
    private final UserAccountRepository userRepository;

    @Transactional
    public InvoiceRecord checkout(String username, CheckoutRequestDTO billingData) {
        UserAccount user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ShoppingCart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot checkout empty cart");
        }

        InvoiceRecord invoice = InvoiceMapper.createInvoiceEntity(user, cart.getItems());

        invoice.setClientName(billingData.getCardHolderName());
        invoice.setClientAddress(billingData.getStreet());
        invoice.setClientCity(billingData.getCity());
        invoice.setClientCounty(billingData.getCounty());
        invoice.setClientZip(billingData.getZip());

        InvoiceRecord savedInvoice = invoiceRepository.save(invoice);

        cart.getItems().clear();
        cartRepository.save(cart);

        return savedInvoice;
    }

    public List<InvoiceRecord> getMyInvoices(String username) {
        UserAccount user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return invoiceRepository.findByBuyer(user);
    }
}