import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyCart, removeFromCart } from "../../api/backend";
import type { ShoppingCartDTO } from "../../types/ShoppingCart";
import {
    CircularProgress,
    Button,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    Typography,
    Box,
    Stack
} from "@mui/material";
import {
    ModulePageContainer,
    ModulePageHeader,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell
} from "../../ui/ModulePage.styles";
import { showError, showSuccess } from "../../utils/toast";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddIcon from '@mui/icons-material/Add';

export default function MyProductsListPage() {
    const [cart, setCart] = useState<ShoppingCartDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const loadCart = () => {
        setLoading(true);
        fetchMyCart()
            .then(setCart)
            .catch((err) => {
                console.error("Cart error:", err);
                showError("Failed to load cart.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleRemove = async (cartItemId: number) => {
        try {
            // Note: In backend.ts, removeFromCart usually expects the cartItemId
            await removeFromCart(cartItemId);
            showSuccess("Item removed.");
            loadCart();
        } catch (err) {
            showError("Could not remove item.");
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 5, color: '#2C6E49' }} />;

    return (
        <ModulePageContainer>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <ModulePageHeader sx={{ m: 0 }}>Review Your Order</ModulePageHeader>
                {cart && cart.items.length > 0 && (
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/products")}
                        sx={{ color: '#2C6E49', fontWeight: 'bold' }}
                    >
                        Add More
                    </Button>
                )}
            </Box>

            {cart && cart.items.length > 0 ? (
                <>
                    <ModuleTableContainer component={Paper} sx={{ borderRadius: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <ModuleTableHeader>Product</ModuleTableHeader>
                                    <ModuleTableHeader>Quantity</ModuleTableHeader>
                                    <ModuleTableHeader align="right">Action</ModuleTableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.productId}>
                                        <ModuleTableCell sx={{ fontWeight: 600 }}>
                                            {item.productName}
                                        </ModuleTableCell>
                                        <ModuleTableCell>
                                            <Typography variant="body2">{item.quantity} units</Typography>
                                        </ModuleTableCell>
                                        <ModuleTableCell align="right">
                                            <Button
                                                variant="text"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemove(item.productId)}
                                            >
                                                Remove
                                            </Button>
                                        </ModuleTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ModuleTableContainer>

                    <Stack spacing={2} sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<ShoppingBagIcon />}
                            sx={{
                                bgcolor: '#2C6E49',
                                py: 1.8,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(44, 110, 73, 0.2)',
                                '&:hover': { bgcolor: '#1e4a32' }
                            }}
                            onClick={() => navigate("/payment")}
                        >
                            Confirm Order & Pay
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate("/products")}
                            sx={{ py: 1.2, borderRadius: 2, borderColor: '#2C6E49', color: '#2C6E49' }}
                        >
                            Cancel and Go Back
                        </Button>
                    </Stack>
                </>
            ) : (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: '#fcfdfc' }}>
                    <ShoppingBagIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={4}>
                        You haven't added any items to your order yet.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#2C6E49', px: 4, py: 1.2, '&:hover': { bgcolor: '#1e4a32' } }}
                        onClick={() => navigate("/products")}
                    >
                        Start a New Order
                    </Button>
                </Paper>
            )}
        </ModulePageContainer>
    );
}