import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, CircularProgress, Divider } from "@mui/material";
import { fetchInvoiceById, payInvoice } from "../../api/backend";
import { showSuccess, showError } from "../../utils/toast";
import type { InvoiceDTO } from "../../types/Invoice";

import {
    ModulePageContainer,
    SuccessCard,
    ModulePageHeader,
    SummaryBox,
    PrimaryButton,
    OutlinedButton
} from "../../ui/ModulePage.styles";

export default function PayInvoicePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState<InvoiceDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [processing, setProcessing] = useState<boolean>(false);

    const [cardData, setCardData] = useState({
        cardHolderName: localStorage.getItem("username") || "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    useEffect(() => {
        if (id) {
            fetchInvoiceById(Number(id))
                .then(data => setInvoice(data))
                .catch(err => {
                    console.error(err);
                    showError("Could not load invoice details.");
                    navigate("/my-products");
                })
                .finally(() => setLoading(false));
        }
    }, [id, navigate]);

    const handlePayment = async () => {
        // Validare simplă formular card
        if (!cardData.cardHolderName || !cardData.cardNumber || !cardData.expiry || !cardData.cvv) {
            showError("Please fill in all card details.");
            return;
        }

        if (!invoice) return;

        setProcessing(true);
        try {
            const paidInvoice = await payInvoice(invoice.id);

            showSuccess("Payment successful!");

            navigate("/payment-success", { state: { invoice: paidInvoice } });

        } catch (error) {
            showError("Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '40px auto' }} />;

    if (!invoice) return null;

    return (
        <ModulePageContainer>
            <SuccessCard>
                <ModulePageHeader sx={{ mb: 1 }}>
                    Secure Checkout
                </ModulePageHeader>

                <Typography variant="body1" textAlign="center" color="text.secondary" mb={2}>
                    You are paying an existing pending invoice.
                </Typography>

                <SummaryBox>
                    <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                        Total to Pay
                    </Typography>
                    <Typography variant="h3" color="#2C6E49" fontWeight="650" my={1}>
                        {invoice.totalGross.toFixed(2)} <span style={{fontSize: '1.2rem'}}>RON</span>
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: '#c8e6c9' }} />
                    <Typography variant="body1" fontWeight="500">
                        Invoice #{invoice.series}{invoice.number}
                    </Typography>
                </SummaryBox>

                <Box width="100%" textAlign="left" mt={2} mb={3}>
                    <Typography variant="h6" color="#2C6E49" fontWeight="bold" mb={2}>
                        Payment Details
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Cardholder Name"
                            fullWidth size="small"
                            value={cardData.cardHolderName}
                            onChange={e => setCardData({...cardData, cardHolderName: e.target.value})}
                        />
                        <TextField
                            label="Card Number"
                            fullWidth size="small"
                            placeholder="0000 0000 0000 0000"
                            value={cardData.cardNumber}
                            onChange={e => setCardData({...cardData, cardNumber: e.target.value})}
                        />
                        <Box display="flex" gap={2}>
                            <TextField
                                label="Expiry Date"
                                placeholder="MM/YY"
                                fullWidth size="small"
                                value={cardData.expiry}
                                onChange={e => setCardData({...cardData, expiry: e.target.value})}
                            />
                            <TextField
                                label="CVV"
                                type="password"
                                fullWidth size="small"
                                value={cardData.cvv}
                                onChange={e => setCardData({...cardData, cvv: e.target.value})}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={2} width="100%">
                    <PrimaryButton
                        fullWidth
                        size="large"
                        onClick={handlePayment}
                        disabled={processing}
                    >
                        {processing ? <CircularProgress size={24} color="inherit" /> : `PAY ${invoice.totalGross.toFixed(2)} RON`}
                    </PrimaryButton>

                    <OutlinedButton
                        fullWidth
                        size="large"
                        onClick={() => navigate("/my-products")}
                        disabled={processing}
                    >
                        Cancel
                    </OutlinedButton>
                </Box>
            </SuccessCard>
        </ModulePageContainer>
    );
}