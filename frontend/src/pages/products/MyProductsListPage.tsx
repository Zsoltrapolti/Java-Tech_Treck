import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <--- IMPORT NOU
import { fetchMyCart, removeFromCart, performCheckout, payInvoice } from "../../api/backend"; // Am scos generateAndOpenPdf
import type { ShoppingCartDTO } from "../../types/ShoppingCart";
import {
    ModulePageContainer,
    ModuleTableContainer,
    ModulePageHeader,
    ModuleTableHeader,
    ModuleTableCell,
    DeleteButton,
    AddButton
} from "../../ui/ModulePage.styles";
import { Table, TableHead, TableRow, TableBody, CircularProgress } from "@mui/material";
import { showSuccess, showError } from "../../utils/toast";

export default function MyProductsListPage() {
    const [cart, setCart] = useState<ShoppingCartDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const loadCart = () => {
        fetchMyCart()
            .then((data) => {
                setCart(data);
            })
            .catch((err) => {
                console.error("Cart error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleRemoveItem = async (cartItemId: number) => {
        try {
            await removeFromCart(cartItemId);
            setCart(prev => prev ? {
                ...prev,
                items: prev.items.filter(item => item.id !== cartItemId),
                grandTotal: prev.items.filter(item => item.id !== cartItemId).reduce((sum, i) => sum + i.totalLinePrice, 0)
            } : null);
            showSuccess("Item removed from cart.");
        } catch {
            showError("Failed to remove item.");
        }
    };

    const handleCheckoutAndPay = async () => {
        try {
            const orderSummary = await performCheckout();
            const invoiceData = await payInvoice(orderSummary.orderId);
            setCart(null);
            navigate("/payment-success", { state: { invoice: invoiceData } });

        } catch (error) {
            console.error(error);
            showError("Checkout processing failed.");
        }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>My Shopping Cart</ModulePageHeader>
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
                                    <AddButton onClick={handleCheckoutAndPay}>
                                        CHECKOUT & PAY
                                    </AddButton>
                                </ModuleTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}