
import { useEffect, useState } from "react";
import { fetchProducts, updateProduct } from "../../api/backend";
import type { ProductType } from "../../types/Product";

import {
    ModulePageContainer,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell,
    ModulePageHeader,
} from '../../ui/ModulePage.styles';

import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    CircularProgress
} from "@mui/material";

export default function ProductsListPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchProducts()
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    const handleClaimProduct = async (product: ProductType) => {
     try {

         const response = await fetch(`http://localhost:8081/api/products/${product.id}/claim`, {
             method: "PUT",
             headers: {
                 "Authorization": `Basic ${localStorage.getItem("authToken")}`
             }
         });

         if (response.ok) {
             alert(`${product.name} a fost adăugat în lista ta!`);

             setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ownerUsername: localStorage.getItem("username") } : p));
         }
     } catch (err) {
         alert("Eroare la adăugarea produsului.");
     }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>Our Fried Potatoes Menu</ModulePageHeader>
            <ModuleTableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <ModuleTableHeader>ID</ModuleTableHeader>
                            <ModuleTableHeader>Name</ModuleTableHeader>
                            <ModuleTableHeader>Unit</ModuleTableHeader>
                            <ModuleTableHeader>In Stock</ModuleTableHeader>
                            <ModuleTableHeader>Action</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.id}>
                                <ModuleTableCell>{product.id}</ModuleTableCell>
                                <ModuleTableCell>{product.name}</ModuleTableCell>
                                <ModuleTableCell>{product.unitOfMeasure}</ModuleTableCell>
                                <ModuleTableCell>{product.quantity}</ModuleTableCell>
                                <ModuleTableCell>
                                    <button
                                        onClick={() => handleClaimProduct(product)}
                                        style={{ cursor: 'pointer', padding: '5px 10px' }}
                                    >
                                        Add to My Orders
                                    </button>
                                </ModuleTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}