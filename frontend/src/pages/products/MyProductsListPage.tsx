import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyCart, fetchMyPendingInvoices, removeFromCart, performCheckout } from "../../api/backend";
import type { ShoppingCartDTO } from "../../types/ShoppingCart";
import type { CheckoutRequestDTO } from "../../types/CheckoutRequestDTO";
import type { InvoiceDTO } from "../../types/Invoice";
import {
    ModulePageContainer,
    ModuleTableContainer,
    ModulePageHeader,
    ModuleTableHeader,
    ModuleTableCell,
    DeleteButton,
    AddButton,
    ModalTitle,
    ModalContent,
    ModalActions,
    PrimaryButton,
    OutlinedButton
} from "../../ui/ModulePage.styles";
import { Table, TableHead, TableRow, TableBody, CircularProgress, Box, Typography, Dialog, TextField } from "@mui/material";
import { showSuccess, showError } from "../../utils/toast";

export default function MyProductsListPage() {
    const [cart, setCart] = useState<ShoppingCartDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const [pendingInvoices, setPendingInvoices] = useState<InvoiceDTO[]>([]);

    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [billingData, setBillingData] = useState<CheckoutRequestDTO>({
        cardHolderName: localStorage.getItem("username") || "",
        street: "",
        city: "",
        county: "",
        zip: ""
    });

    const loadCart = () => {
        fetchMyCart()
            .then((data) => setCart(data))
            .catch((err) => console.error("Cart error:", err))
            .finally(() => setLoading(false));
    };

    const loadPendingInvoices = () => {
        fetchMyPendingInvoices()
            .then((data) => {
                setPendingInvoices(data);
            })
            .catch(console.error);
    };

    useEffect(() => {
        loadCart();
        loadPendingInvoices();
    }, []);

    const handleRemoveItem = async (cartItemId: number) => {
        try {
            await removeFromCart(cartItemId);
            loadCart();
            showSuccess("Item removed from cart.");
        } catch {
            showError("Failed to remove item.");
        }
    };

    const goToCheckout = () => {
        navigate("/checkout");
    };

    const payPendingInvoice = (invoiceId: number) => {
        navigate(`/pay-invoice/${invoiceId}`);
    };

    const handleOpenBillingModal = () => {
        setIsBillingModalOpen(true);
    };

    const submitPayLater = async () => {
        if (!billingData.street || !billingData.city || !billingData.county || !billingData.zip) {
            showError("Please fill in all billing address fields.");
            return;
        }

        try {
            const createdInvoice = await performCheckout(billingData);
            setIsBillingModalOpen(false);
            showSuccess("Order placed! Awaiting payment.");
            navigate("/payment-waiting", { state: { invoice: createdInvoice } });

        } catch (error) {
            console.error("Checkout error:", error);
            showError("Failed to place order.");
        }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>My Shopping Cart</ModulePageHeader>

            {pendingInvoices.length > 0 && (
                <Box mb={4}>
                    {pendingInvoices.map((inv) => (
                        <Box key={inv.id} sx={{
                            backgroundColor: '#f6fffa',
                            border: '1px solid #e60000',
                            borderRadius: '8px',
                            p: 2,
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Box>
                                    <Typography sx={{ color: '#e60000', fontWeight: 'bold' }}>
                                        Unpaid Invoice #{inv.series}{inv.number}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total: <b>{inv.totalGross.toFixed(2)} RON</b> | Due Date: <b>{inv.dueDate}</b>
                                    </Typography>
                                </Box>
                            </Box>

                            <PrimaryButton onClick={() => payPendingInvoice(inv.id)}>
                                PAY NOW
                            </PrimaryButton>
                        </Box>
                    ))}
                </Box>
            )}

            <ModuleTableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <ModuleTableHeader>Product Name</ModuleTableHeader>
                            <ModuleTableHeader>Quantity</ModuleTableHeader>
                            <ModuleTableHeader>Price/Unit</ModuleTableHeader>
                            <ModuleTableHeader>Line Total</ModuleTableHeader>
                            <ModuleTableHeader>Action</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!cart || cart.items.length === 0 ? (
                            <TableRow>
                                <ModuleTableCell colSpan={5} style={{ textAlign: 'center' }}>
                                    Your cart is empty. Go to the Menu to add products.
                                </ModuleTableCell>
                            </TableRow>
                        ) : (
                            cart.items.map(item => (
                                <TableRow key={item.id}>
                                    <ModuleTableCell>{item.productName}</ModuleTableCell>
                                    <ModuleTableCell>
                                        {item.quantity} {item.unitOfMeasure}
                                    </ModuleTableCell>
                                    <ModuleTableCell>{item.pricePerUnit.toFixed(2)}</ModuleTableCell>
                                    <ModuleTableCell>{item.totalLinePrice.toFixed(2)}</ModuleTableCell>
                                    <ModuleTableCell>
                                        <DeleteButton onClick={() => handleRemoveItem(item.id)}>
                                            Remove
                                        </DeleteButton>
                                    </ModuleTableCell>
                                </TableRow>
                            ))
                        )}

                        {cart && cart.items.length > 0 && (
                            <TableRow>
                                <ModuleTableCell colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    GRAND TOTAL:
                                </ModuleTableCell>
                                <ModuleTableCell style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2C6E49' }}>
                                    {cart.grandTotal?.toFixed(2)} RON
                                </ModuleTableCell>
                                <ModuleTableCell>
                                    <Box display="flex" gap={1}>
                                        <AddButton onClick={handleOpenBillingModal}>
                                            PAY LATER
                                        </AddButton>
                                        <AddButton onClick={goToCheckout}>
                                            PROCEED TO CHECKOUT
                                        </AddButton>
                                    </Box>
                                </ModuleTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ModuleTableContainer>

            <Dialog open={isBillingModalOpen} onClose={() => setIsBillingModalOpen(false)}>
                <ModalTitle>Billing Details for Pay Later</ModalTitle>
                <ModalContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Please provide your billing address to generate the invoice. No card details required.
                    </Typography>

                    <TextField
                        label="Full Name / Company"
                        fullWidth size="small"
                        value={billingData.cardHolderName}
                        onChange={e => setBillingData({...billingData, cardHolderName: e.target.value})}
                    />
                    <TextField
                        label="Street Address"
                        fullWidth size="small"
                        value={billingData.street}
                        onChange={e => setBillingData({...billingData, street: e.target.value})}
                    />
                    <Box display="flex" gap={2}>
                        <TextField
                            label="City"
                            fullWidth size="small"
                            value={billingData.city}
                            onChange={e => setBillingData({...billingData, city: e.target.value})}
                        />
                        <TextField
                            label="County"
                            fullWidth size="small"
                            value={billingData.county}
                            onChange={e => setBillingData({...billingData, county: e.target.value})}
                        />
                    </Box>
                    <TextField
                        label="Zip Code"
                        fullWidth size="small"
                        value={billingData.zip}
                        onChange={e => setBillingData({...billingData, zip: e.target.value})}
                    />
                </ModalContent>
                <ModalActions>
                    <OutlinedButton onClick={() => setIsBillingModalOpen(false)}>Cancel</OutlinedButton>
                    <PrimaryButton onClick={submitPayLater}>Confirm Order</PrimaryButton>
                </ModalActions>
            </Dialog>

        </ModulePageContainer>
    );
}