import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, TextField, Paper, Divider, CircularProgress
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import Grid from "@mui/material/Grid";

import { fetchMyCart, performCheckout, payInvoice } from "../../api/backend";
import type { ShoppingCartDTO } from "../../types/ShoppingCart";
import { showError } from "../../utils/toast";

import {
    ModulePageContainer, ModulePageHeader,
    PrimaryButton
} from "../../ui/ModulePage.styles";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<ShoppingCartDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [address, setAddress] = useState({
        street: "",
        city: "",
        county: "",
        zip: ""
    });

    const [card, setCard] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    });

    useEffect(() => {
        fetchMyCart()
            .then(data => setCart(data))
            .catch(() => showError("Could not load cart details"))
            .finally(() => setLoading(false));
    }, []);

    const handlePay = async () => {
        if (!address.street || !address.city || !card.number || !card.cvv || !card.name) {
            showError("Please fill in all address and payment details.");
            return;
        }

        setProcessing(true);
        try {
            const billingData = {
                street: address.street,
                city: address.city,
                county: address.county,
                zip: address.zip,
                cardHolderName: card.name
            };
            const orderSummary = await performCheckout(billingData);
            await new Promise(r => setTimeout(r, 1500));
            const invoiceData = await payInvoice(orderSummary.orderId);
            navigate("/payment-success", { state: { invoice: invoiceData } });

        } catch (error) {
            console.error(error);
            showError("Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '50px auto' }} />;
    if (!cart || cart.items.length === 0) {
        return <Typography textAlign="center" mt={5}>Your cart is empty.</Typography>;
    }

    return (
        <ModulePageContainer>
            <ModulePageHeader>
                Payment & Checkout
            </ModulePageHeader>

            <Grid container spacing={4} justifyContent="center">
                <Grid size={{ xs: 12, md: 8 }}>

                    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <Typography variant="h6" fontWeight="bold">
                                Billing & Shipping Address
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12}}>
                                <TextField
                                    label="Full Address"
                                    fullWidth
                                    value={address.street}
                                    onChange={e => setAddress({...address, street: e.target.value})}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="City"
                                    fullWidth
                                    value={address.city}
                                    onChange={e => setAddress({...address, city: e.target.value})}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="County / Region"
                                    fullWidth
                                    value={address.county}
                                    onChange={e => setAddress({...address, county: e.target.value})}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Zip Code"
                                    fullWidth
                                    value={address.zip}
                                    onChange={e => setAddress({...address, zip: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <Typography variant="h6" fontWeight="bold">
                                Payment Method
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Card Number"
                                    placeholder="0000 0000 0000 0000"
                                    fullWidth
                                    value={card.number}
                                    onChange={e => setCard({...card, number: e.target.value})}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Cardholder Name"
                                    fullWidth
                                    value={card.name}
                                    onChange={e => setCard({...card, name: e.target.value})}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Expiry (MM/YY)"
                                    fullWidth
                                    value={card.expiry}
                                    onChange={e => setCard({...card, expiry: e.target.value})}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="CVV"
                                    type="password"
                                    fullWidth
                                    value={card.cvv}
                                    onChange={e => setCard({...card, cvv: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            position: { md: "sticky" },
                            top: 100
                    }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Order Summary
                        </Typography>

                        {cart.items.map(item => (
                            <Box
                                key={item.id}
                                display="flex"
                                justifyContent="space-between"
                                mb={1.5}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {item.productName} (x{item.quantity})
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {item.totalLinePrice.toFixed(2)} RON
                                </Typography>
                            </Box>
                        ))}

                        <Divider sx={{ my: 3 }} />

                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography variant="h6">
                                Total:
                            </Typography>
                            <Typography variant="h5" color="#2C6E49" fontWeight="bold">
                                {cart.grandTotal.toFixed(2)} RON
                            </Typography>
                        </Box>

                        <PrimaryButton
                            fullWidth
                            size="large"
                            onClick={handlePay}
                            disabled={processing}
                            startIcon={
                                processing
                                    ? <CircularProgress size={20} color="inherit"/>
                                    : <LockIcon />
                            }
                            sx={{ height: 50 }}
                        >
                            {processing ? "Processing..." : "PAY NOW"}
                        </PrimaryButton>

                        <Typography
                            variant="caption"
                            display="block"
                            textAlign="center"
                            mt={2}
                            color="text.secondary"
                        >
                            <LockIcon sx={{ fontSize: 12, mr: 0.5 }} />
                            SSL encrypted payment
                        </Typography>
                    </Paper>
                </Grid>

            </Grid>
        </ModulePageContainer>
    );
}