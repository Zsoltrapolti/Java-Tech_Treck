import { useEffect, useState } from "react";
import { fetchMyProducts, unclaimProduct } from "../../api/backend";
import type { ProductType } from "../../types/Product";
import {
    ModulePageContainer,
    ModuleTableContainer,
    ModulePageHeader,
    ModuleTableHeader,
    ModuleTableCell
} from "../../ui/ModulePage.styles";
import { Table, TableHead, TableRow, TableBody, CircularProgress } from "@mui/material";

export default function MyProductsListPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchMyProducts()
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading your personal menu:", err);
                setLoading(false);
            });
    }, []);


 const handleRemove = async (productId: number) => {
     try {
         await unclaimProduct(productId);
         setProducts(prev => prev.filter(p => p.id !== productId));
     } catch (err) {
         alert("Eroare la eliminarea produsului.");
     }
 };

    if (loading) {
        return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;
    }

    return (
        <ModulePageContainer>
            <ModulePageHeader>My Personal Krumpi Selection</ModulePageHeader>
            <ModuleTableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>

                            <ModuleTableHeader>Name</ModuleTableHeader>
                            <ModuleTableHeader>Unit</ModuleTableHeader>
                            <ModuleTableHeader>Quantity</ModuleTableHeader>
                            <ModuleTableHeader>Action</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <ModuleTableCell colSpan={4} style={{ textAlign: 'center' }}>
                                    Your selection is empty. Add products from the Menu.
                                </ModuleTableCell>
                            </TableRow>
                        ) : (
                            products.map(p => (
                                <TableRow key={p.id}>
                                    <ModuleTableCell>{p.name}</ModuleTableCell>
                                    <ModuleTableCell>{p.unitOfMeasure}</ModuleTableCell>
                                    <ModuleTableCell>{p.quantity}</ModuleTableCell>
                                    <ModuleTableCell>
                                        <button
                                            onClick={() => handleRemove(p.id)}
                                            style={{
                                                backgroundColor: '#ff4d4d',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </ModuleTableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}