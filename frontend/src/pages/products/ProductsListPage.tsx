
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
       const currentUsername = localStorage.getItem("username");

       if (!currentUsername) {
           alert("Please log in again.");
           return;
       }

       try {
           const updatedProduct = { ...product, ownerUsername: currentUsername };
           await updateProduct(updatedProduct);

           alert(`${product.name} added to My Orders!`);
           window.location.reload();
       } catch (err) {
           console.error("Failed to add product:", err);
           alert("Error: Could not add product to orders.");
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