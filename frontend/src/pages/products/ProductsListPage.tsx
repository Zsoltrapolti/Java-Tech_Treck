import { useEffect, useState } from "react";
import { fetchProducts, addProductToMyList } from "../../api/backend";
import {
    Table, TableHead, TableRow, TableBody, Button, CircularProgress, Paper
} from "@mui/material";
import { ModulePageContainer, ModulePageHeader, ModuleTableContainer, ModuleTableHeader, ModuleTableCell } from "../../ui/ModulePage.styles";
import { showError } from "../../utils/toast";

export default function ProductsListPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleAddToMyList = async (productId: number) => {
        try {
            await addProductToMyList(productId);
            alert("Success! Item added to your cart.");
        } catch (error: any) {
            console.error(error);
            showError(new Error("Failed to add product."));
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 5 }} />;

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
                                <ModuleTableCell>{p.name}</ModuleTableCell>
                                <ModuleTableCell>{p.unitOfMeasure}</ModuleTableCell>
                                <ModuleTableCell>{p.quantity}</ModuleTableCell>
                                <ModuleTableCell>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={() => handleAddToMyList(p.id)}
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