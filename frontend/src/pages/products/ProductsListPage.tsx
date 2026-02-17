import { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../../api/backend"; // Use addToCart for specific quantity
import {
    Table, TableHead, TableRow, TableBody, Button, CircularProgress, Paper
} from "@mui/material";
import {
    ModulePageContainer,
    ModulePageHeader,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell
} from "../../ui/ModulePage.styles";
import { showError, showSuccess } from "../../utils/toast";
import type { ProductType } from "../../types/Product";

export default function ProductsListPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch((err) => {
                console.error(err);
                showError(new Error("Failed to load the menu."));
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAddToCart = async (productId: number) => {
        try {
            // Defaulting to 1 for the 'Add' button
            await addToCart(productId, 1);
            showSuccess("Item added to your cart!");
        } catch (error: any) {
            showError(new Error("Could not add item to cart."));
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 5, color: '#2C6E49' }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>Our Menu</ModulePageHeader>
            <ModuleTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <ModuleTableHeader>Name</ModuleTableHeader>
                            <ModuleTableHeader>Unit</ModuleTableHeader>
                            <ModuleTableHeader>In Stock</ModuleTableHeader>
                            <ModuleTableHeader>Action</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.id}>
                                <ModuleTableCell sx={{ fontWeight: 500 }}>{p.name}</ModuleTableCell>
                                <ModuleTableCell>{p.unitOfMeasure}</ModuleTableCell>
                                <ModuleTableCell>{p.quantity}</ModuleTableCell>
                                <ModuleTableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ bgcolor: '#2C6E49', '&:hover': { bgcolor: '#1e4a32' } }}
                                        onClick={() => handleAddToCart(p.id!)}
                                    >
                                        ADD TO MY ITEMS
                                    </Button>
                                </ModuleTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}