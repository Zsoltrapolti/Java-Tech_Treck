import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField, Button, MenuItem, Select, InputLabel,
    FormControl, Grid, IconButton, Typography, Card, CardContent
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { fetchProducts, createOrder, fetchMe } from "../../api/backend";
import { showError, showSuccess } from "../../utils/toast";
import type { OrderType, OrderItemType } from "../../types/Order";
import type { ProductType } from "../../types/Product";
import { ModulePageContainer, ModulePageHeader } from "../../ui/ModulePage.styles";

export function UserCreateOrderPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductType[]>([]);

    const [order, setOrder] = useState<OrderType>({
        customerName: localStorage.getItem("username") || "",
        creationDate: new Date().toISOString().slice(0, 16),
        status: "PENDING",
        responsibleEmployeeId: 1, // Ensure this matches a valid ID in your DB
        items: [] // Start empty for a better UX
    });

    useEffect(() => {
        const initData = async () => {
            try {
                const productData = await fetchProducts();
                setProducts(productData);

                const userData = await fetchMe();
                if (userData) {
                    setOrder(prev => ({...prev, customerName: userData.username}));
                }
            } catch (err: any) {
                showError(new Error("Failed to load products."));
            }
        };
        initData();
    }, []);

    const addItemRow = () => {
        setOrder(prev => ({
            ...prev,
            items: [...prev.items, {productId: 0, quantity: 1, unitPrice: 0}]
        }));
    };

    const removeItemRow = (index: number) => {
        setOrder(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: keyof OrderItemType, value: any) => {
        const newItems = [...order.items];
        const item = {...newItems[index], [field]: value};

        // Auto-fill price when product is selected
        if (field === 'productId') {
            const selectedProduct = products.find(p => p.id === value);
            // Accessing price directly from ProductDTO structure
            item.unitPrice = selectedProduct ? selectedProduct.price : 0;
        }

        newItems[index] = item;
        setOrder(prev => ({...prev, items: newItems}));
    };

    const handleSubmit = async () => {
        if (order.items.length === 0) {
            showError(new Error("Your order is empty."));
            return;
        }

        setLoading(true);
        try {
            // Formatting date to match backend LocalDateTime expectations
            const payload = {
                ...order,
                creationDate: new Date(order.creationDate).toISOString().slice(0, 19)
            };

            await createOrder(payload);
            showSuccess("Order placed successfully!");
            navigate("/my-orders");
        } catch (error: any) {
            showError(new Error("Failed to create order. Please check stock levels."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModulePageContainer>
            <ModulePageHeader>Manual Order Entry</ModulePageHeader>
            <Card style={{maxWidth: 800, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Customer" fullWidth value={order.customerName} disabled variant="filled"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Order Date"
                                type="datetime-local"
                                fullWidth
                                value={order.creationDate}
                                onChange={(e) => setOrder({...order, creationDate: e.target.value})}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" weight="bold">Order Items</Typography>
                        </Grid>

                        {order.items.map((item, index) => (
                            <Grid container item spacing={2} key={index} alignItems="center">
                                <Grid item xs={5}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Select Product</InputLabel>
                                        <Select
                                            value={item.productId || ""}
                                            label="Select Product"
                                            onChange={(e) => handleItemChange(index, 'productId', Number(e.target.value))}
                                        >
                                            {products.map(p => (
                                                <MenuItem key={p.id} value={p.id}>
                                                    {p.name} — {p.price.toFixed(2)} RON /{p.unitOfMeasure}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Qty"
                                        type="number"
                                        size="small"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2" color="textSecondary">
                                        Total: {(item.quantity * item.unitPrice).toFixed(2)} RON
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton color="error" onClick={() => removeItemRow(index)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleOutlineIcon/>} onClick={addItemRow} variant="text">
                                Add Item
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading || order.items.length === 0}
                                style={{backgroundColor: '#2C6E49', padding: '12px'}}
                            >
                                {loading ? "Processing..." : "Confirm Order"}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </ModulePageContainer>
    );
}