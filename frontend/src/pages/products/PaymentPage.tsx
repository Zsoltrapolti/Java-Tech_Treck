import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyCart, performCheckout, payInvoice } from "../../api/backend";
import type { ShoppingCartDTO } from "../../types/ShoppingCart";
import {
    CircularProgress,
    Box,
    Typography,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import {
    ModulePageContainer,
    ModulePageHeader,
    PrimaryButton,
    OutlinedButton
} from "../../ui/ModulePage.styles";
import { showError, showSuccess } from "../../utils/toast";

export default function PaymentPage() {
    const [cart, setCart] = useState<ShoppingCartDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyCart()
            .then(setCart)
            .catch(() => showError("Could not load your order summary."))
            .finally(() => setLoading(false));
    }, []);

    const handleConfirmAndPay = async () => {
        setProcessing(true);
        try {
            const summary = await performCheckout(); // Gets OrderSummaryDTO

            if (!summary || !summary.orderId) {
                throw new Error("Backend failed to create an invoice.");
            }

            // The payInvoice function returns the full InvoiceDTO
            const paidInvoice = await payInvoice(summary.orderId);

            showSuccess("Transaction successful!");

            // Pass the full paidInvoice to the Success Page
            navigate("/payment-success", { state: { invoice: paidInvoice } });
        } catch (err: any) {
            showError(err.message || "Payment failed");
        } finally {
            setProcessing(false);
        }
    };
    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 5 }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>Finalize Payment</ModulePageHeader>

            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h6" gutterBottom fontWeight="600">
                        Order Review
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List disablePadding>
                        {cart?.items.map((item) => (
                            <ListItem key={item.productId} sx={{ px: 0, py: 1 }}>
                                <ListItemText
                                    primary={item.productName}
                                    secondary={`Quantity: ${item.quantity}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            By clicking "Pay Now", you agree to complete the purchase.
                            The total will be calculated based on current menu pricing.
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <PrimaryButton
                            onClick={handleConfirmAndPay}
                            disabled={processing || !cart?.items.length}
                        >
                            {processing ? <CircularProgress size={24} color="inherit" /> : "Pay Now"}
                        </PrimaryButton>

                        <OutlinedButton
                            onClick={() => navigate("/my-products")}
                            disabled={processing}
                        >
                            Back to Cart
                        </OutlinedButton>
                    </Box>
                </Paper>
            </Box>
        </ModulePageContainer>
    );
}