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
         responsibleEmployeeId: 2, //employee-ul hardcodat
         items: [{ productId: 999, quantity: 1, unitPrice: 10.0 }]
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


    const addItemRow = () => {
        setOrder(prev => ({
            ...prev,
            items: [...prev.items, { productId: 0, quantity: 1, unitPrice: 0 }]
        }));
    };


    const removeItemRow = (index: number) => {
        const newItems = [...order.items];
        newItems.splice(index, 1);
        setOrder(prev => ({ ...prev, items: newItems }));
    };


    const handleItemChange = (index: number, field: keyof OrderItemType, value: any) => {
        const newItems = [...order.items];
        const item = { ...newItems[index], [field]: value };


        if (field === 'productId') {
            const selectedProduct = products.find(p => p.id === value);

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

                        {/* Customer & Date Info */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Customer Name"
                                fullWidth
                                value={order.customerName}
                                disabled
                            />
                        </Grid>

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

                        {/* Products Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginTop: 10, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                                Products
                            </Typography>
                        </Grid>

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
                                <Grid item xs={4}>
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton color="error" onClick={() => removeItemRow(index)} disabled={order.items.length === 1}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={addItemRow}
                                variant="outlined"
                                color="secondary"
                            >
                                Add Another Product
                            </Button>
                        </Grid>

                        {/* Submit Action */}
                        <Grid item xs={12} style={{ marginTop: 20 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Placing Order..." : "Submit Order"}
                            </Button>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </ModulePageContainer>
    );
}