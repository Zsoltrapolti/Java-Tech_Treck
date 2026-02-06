import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box, Typography, TextField, CircularProgress, Divider
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';

import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from "../../components/pdf/InvoiceDocument";
import { sendInvoiceToEmail } from "../../api/backend";
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

export default function PaymentSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const invoice = location.state?.invoice as InvoiceDTO | undefined;

    const [email, setEmail] = useState<string>(invoice?.clientName || "");
    const [sendingEmail, setSendingEmail] = useState(false);

    if (!invoice) {
        return (
            <ModulePageContainer>
                <SuccessCard>
                    <Typography variant="h5" color="error">No invoice data found.</Typography>
                    <PrimaryButton onClick={() => navigate("/")}>
                        Go Home
                    </PrimaryButton>
                </SuccessCard>
            </ModulePageContainer>
        );
    }

    const handleViewPdf = async () => {
        try {
            const element = React.createElement(InvoiceDocument, { invoice });
            const blob = await pdf(element as any).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (e) {
            console.error(e);
            showError("Could not generate PDF.");
        }
    };

    const handleSendEmail = async () => {
        if (!email || !email.includes('@')) {
            showError("Please enter a valid email address.");
            return;
        }

        setSendingEmail(true);
        try {
            if (!invoice || !invoice.id) {
                showError("Error: Missing Invoice ID.");
                return;
            }

            await sendInvoiceToEmail(invoice.id, email);
            showSuccess(`Invoice sent to ${email}`);
        } catch (e) {
            showError("Error sending email.");
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <ModulePageContainer>
            <SuccessCard>
                <CheckCircleIcon sx={{ fontSize: 60, color: '#2C6E49' }} />

                <ModulePageHeader sx={{ mb: 1 }}>
                    Payment Successful!
                </ModulePageHeader>

                <SummaryBox>
                    <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                        Order Total
                    </Typography>
                    <Typography variant="h3" color="#2C6E49" fontWeight="650" my={1}>
                        {invoice.totalGross.toFixed(2)} <span style={{fontSize: '1.2rem'}}>RON</span>
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: '#c8e6c9' }} />
                    <Typography variant="body1" fontWeight="500">
                        Invoice #{invoice.series}{invoice.number}
                    </Typography>
                </SummaryBox>

                <Box width="100%" textAlign="left" mt={2}>
                    <Typography variant="body2" gutterBottom fontWeight="bold" color="#2C6E49">
                        Send invoice via email:
                    </Typography>
                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            InputProps={{
                                style: { borderRadius: 8, backgroundColor: '#fff' }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2C6E49',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2C6E49',
                                    },
                                },
                            }}
                        />
                        <PrimaryButton
                            disabled={sendingEmail}
                            onClick={handleSendEmail}
                            sx={{ minWidth: '60px', padding: '0' }}
                        >
                            {sendingEmail ? <CircularProgress size={24} color="inherit" /> : <EmailIcon />}
                        </PrimaryButton>
                    </Box>
                </Box>

                <Divider sx={{ width: '100%', my: 1 }} />

                <Box display="flex" flexDirection="column" gap={2} width="100%">
                    <OutlinedButton
                        fullWidth
                        size="large"
                        onClick={handleViewPdf}
                    >
                        View Invoice PDF
                    </OutlinedButton>

                    <OutlinedButton
                        fullWidth
                        size="large"
                        onClick={() => navigate("/")}
                    >
                        Back to Menu
                    </OutlinedButton>
                </Box>
            </SuccessCard>
        </ModulePageContainer>
    );
}