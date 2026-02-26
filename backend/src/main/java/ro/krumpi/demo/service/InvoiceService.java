package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.shopping.CheckoutRequestDTO;
import ro.krumpi.demo.mapper.InvoiceMapper;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.PaymentStatus;
import ro.krumpi.demo.model.shopping.InvoiceRecord;
import ro.krumpi.demo.repository.InvoiceRecordRepository;
import ro.krumpi.demo.repository.ShoppingCartRepository;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.time.LocalDateTime;
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

        var cart = cartRepository.findByUser(user)
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

    public List<InvoiceRecord> getMyOverdueInvoices(String username) {
        UserAccount user = userRepository.findByUsername(username).orElseThrow();
        return invoiceRepository.findByBuyerAndStatusAndDueDateBefore(
                user, PaymentStatus.PENDING_PAYMENT, LocalDateTime.now()
        );
    }

    public List<InvoiceRecord> getMyPendingInvoices(String username) {
        UserAccount user = userRepository.findByUsername(username).orElseThrow();
        return invoiceRepository.findByBuyerAndStatus(user, PaymentStatus.PENDING_PAYMENT);
    }

    public List<InvoiceRecord> getOrdersForMyClients(Long employeeUserId) {
        UserAccount employee = userRepository.findById(employeeUserId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getRole() != Role.EMPLOYEE && employee.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only EMPLOYEE or ADMIN can view client orders");
        }

        return invoiceRepository.findByBuyer_ManagedBy(employee);
    }

    @Transactional
    public InvoiceRecord modifyClientOrder(Long employeeUserId, Long orderId, CheckoutRequestDTO updatedData) {
        UserAccount employee = userRepository.findById(employeeUserId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getRole() != Role.EMPLOYEE && employee.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only EMPLOYEE or ADMIN can modify orders");
        }

        InvoiceRecord invoice = invoiceRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        UserAccount client = invoice.getBuyer();
        if (client.getManagedBy() == null || !client.getManagedBy().getId().equals(employee.getId())) {
            throw new RuntimeException("Access denied: You do not manage this client's orders.");
        }

        if (invoice.getStatus() != PaymentStatus.PENDING_PAYMENT) {
            throw new RuntimeException("Cannot modify an order that is already PAID or CANCELLED.");
        }

        invoice.setClientName(updatedData.getCardHolderName());
        invoice.setClientAddress(updatedData.getStreet());
        invoice.setClientCity(updatedData.getCity());
        invoice.setClientCounty(updatedData.getCounty());
        invoice.setClientZip(updatedData.getZip());

        return invoiceRepository.save(invoice);
    }
}
