package ro.krumpi.demo.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.shopping.InvoiceDTO;
import ro.krumpi.demo.dto.shopping.PaymentDTO;
import ro.krumpi.demo.dto.shopping.PaymentRequest;
import ro.krumpi.demo.mapper.InvoiceMapper;
import ro.krumpi.demo.mapper.ShoppingCartMapper;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.shopping.*;
import ro.krumpi.demo.model.stock.CartItem;
import ro.krumpi.demo.model.stock.Product;
import ro.krumpi.demo.model.stock.ShoppingCart;
import ro.krumpi.demo.repository.*;
import ro.krumpi.demo.mapper.PaymentMapper;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRecordRepository invoiceRepository;
    private final UserAccountRepository userRepository;
    private final ShoppingCartRepository cartRepository;
    private final ProductRepository productRepository;

    @Transactional
    public InvoiceDTO processPayment(String username, PaymentRequest request) {
        UserAccount user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        InvoiceRecord invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (!invoice.getBuyer().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: Order does not belong to user");
        }
        if (invoice.getStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Order is already paid");
        }
        if (invoice.getStatus() == PaymentStatus.CANCELLED) {
            throw new RuntimeException("Cannot pay a cancelled order.");
        }

        for (InvoiceLine line : invoice.getLines()) {
            int updatedRows = productRepository.decrementStock(line.getProductName(), line.getQuantity());
            if (updatedRows == 0) {
                throw new RuntimeException("Payment failed: Out of stock for product '" + line.getProductName() + "'");
            }
        }

        Payment payment = PaymentMapper.createPaymentEntity(user, invoice, request.getPaymentMethod());
        paymentRepository.save(payment);

        invoice.setStatus(PaymentStatus.PAID);
        InvoiceRecord savedInvoice = invoiceRepository.save(invoice);

        return InvoiceMapper.toDTO(savedInvoice);
    }

    @Transactional
    public void cancelPayment(String username, Long invoiceId) {
        UserAccount user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        InvoiceRecord invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (!invoice.getBuyer().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: Invoice does not belong to user");
        }

        if (invoice.getStatus() != PaymentStatus.PENDING_PAYMENT) {
            throw new RuntimeException("Cannot cancel invoice. Status is: " + invoice.getStatus());
        }

        ShoppingCart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    ShoppingCart newCart = ShoppingCartMapper.createEmptyCart(user);
                    return cartRepository.save(newCart);
                });

        for (InvoiceLine line : invoice.getLines()) {
            Product product = productRepository.findByName(line.getProductName());

            if (product != null) {
                Optional<CartItem> existingItem = cart.getItems().stream()
                        .filter(item -> item.getProduct().getId().equals(product.getId()))
                        .findFirst();

                if (existingItem.isPresent()) {
                    CartItem item = existingItem.get();
                    item.setQuantity(item.getQuantity() + line.getQuantity());
                } else {
                    CartItem newItem = ShoppingCartMapper.createCartItemEntity(cart, product, line.getQuantity());
                    cart.getItems().add(newItem);
                }
            } else {
                System.out.println("Produsul " + line.getProductName() + " nu mai există în ofertă.");
            }
        }

        cartRepository.save(cart);

        invoice.setStatus(PaymentStatus.CANCELLED);
        invoiceRepository.save(invoice);
    }
}