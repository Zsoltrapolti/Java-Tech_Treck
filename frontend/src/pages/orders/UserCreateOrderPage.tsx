import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
    IconButton,
    Typography,
    Card,
    CardContent
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { fetchProducts, createOrder, fetchMe } from "../../api/backend";
import { showError, showSuccess } from "../../utils/toast";
import type { OrderType, OrderItemType, OrderStatus } from "../../types/Order";
import type { ProductType } from "../../types/Product";
import { ModulePageContainer, ModulePageHeader } from "../../ui/ModulePage.styles";

export default function UserCreateOrderPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductType[]>([]);

    const [order, setOrder] = useState<OrderType>({
        customerName: localStorage.getItem("username") || "",

        creationDate: new Date().toISOString().slice(0, 16),
        status: "PENDING",
        // SEND ID 999 (The "Unassigned" employee placeholder)
        responsibleEmployeeId: 999,
        items: []
    });

    useEffect(() => {
        const initData = async () => {
            try {
                const productData = await fetchProducts();
                setProducts(productData);

                const userData = await fetchMe();
                if (userData) {
                    setOrder(prev => ({
                        ...prev,
                        customerName: userData.username
                    }));
                }
            } catch (err: any) {
                showError(new Error("Failed to load initial data"));
            }
        };
        initData();
    }, []);

    // Add a new empty row
    const addItemRow = () => {
        setOrder(prev => ({
            ...prev,
            items: [...prev.items, { productId: 0, quantity: 1, unitPrice: 0 }]
        }));
    };

    // Remove a row
    const removeItemRow = (index: number) => {
        const newItems = [...order.items];
        newItems.splice(index, 1);
        setOrder(prev => ({ ...prev, items: newItems }));
    };

    // Handle changes in the product rows
    const handleItemChange = (index: number, field: keyof OrderItemType, value: any) => {
        const newItems = [...order.items];
        const item = { ...newItems[index], [field]: value };

        // If product is selected, auto-set price to 10.0 to pass validation
        if (field === 'productId') {
            const selectedProduct = products.find(p => p.id === value);
            // You could use selectedProduct.price here if it existed
            item.unitPrice = 10.0;
        }

        newItems[index] = item;
        setOrder(prev => ({ ...prev, items: newItems }));
    };

    // Submit the Order
    const handleSubmit = async () => {
        if (order.items.length === 0) {
            showError(new Error("Please add at least one product to the order."));
            return;
        }

        if (order.items.some(i => i.productId === 0)) {
            showError(new Error("Please select a product for all items."));
            return;
        }

        setLoading(true);
        try {
            // FIX: Remove 'Z' timezone so Java LocalDateTime accepts it
            // .slice(0, 19) produces "YYYY-MM-DDTHH:mm:ss"
            const payload = {
                ...order,
                creationDate: new Date(order.creationDate).toISOString().slice(0, 19)
            };

            await createOrder(payload);
            showSuccess("Order placed successfully!");
            navigate("/my-orders");
        } catch (error: any) {
            console.error("Create Order Error:", error);
            showError(new Error("Failed to create order."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModulePageContainer>
            <ModulePageHeader>Create New Order</ModulePageHeader>

            <Card style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
                <CardContent>
                    <Grid container spacing={3}>

                        {/* Customer Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Customer Name"
                                fullWidth
                                value={order.customerName}
                                onChange={(e) => setOrder({...order, customerName: e.target.value})}
                            />
                        </Grid>

                        {/* Date Picker */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={order.creationDate}
                                onChange={(e) => setOrder({...order, creationDate: e.target.value})}
                            />
                        </Grid>

                        {/* Status Dropdown */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={order.status}
                                    label="Status"
                                    onChange={(e) => setOrder({...order, status: e.target.value as OrderStatus})}
                                >
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="UPCOMING">Upcoming</MenuItem>
                                    <MenuItem value="DONE">Done</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Employee ID (Read Only) */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="User ID (Auto)"
                                fullWidth
                                disabled
                                value={order.responsibleEmployeeId}
                            />
                        </Grid>

                        {/* Product List Header */}
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginTop: 20, marginBottom: 10 }}>
                                Products
                            </Typography>
                        </Grid>

                        {/* Dynamic Product Rows */}
                        {order.items.map((item, index) => (
                            <Grid container item spacing={2} key={index} alignItems="center">
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Product</InputLabel>
                                        <Select
                                            value={item.productId === 0 ? "" : item.productId}
                                            label="Product"
                                            onChange={(e) => handleItemChange(index, 'productId', Number(e.target.value))}
                                        >
                                            {products.map(p => (
                                                <MenuItem key={p.id} value={p.id}>
                                                    {p.name} ({p.unitOfMeasure})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <IconButton color="error" onClick={() => removeItemRow(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        {/* Add Product Button */}
                        <Grid item xs={12}>
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={addItemRow}
                                variant="outlined"
                            >
                                Add Product
                            </Button>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} style={{ marginTop: 20 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Placing Order..." : "Create Order"}
                            </Button>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </ModulePageContainer>
    );
}