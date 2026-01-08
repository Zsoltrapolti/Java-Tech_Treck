
import { useEffect, useState } from "react";
import { fetchProducts } from "../../api/backend";
import type { ProductType } from "../../types/Product";
import { claimProduct } from "../../api/backend";

import {
    ModulePageContainer,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell,
    ModulePageHeader, EditButton,
} from '../../ui/ModulePage.styles';

import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    CircularProgress
} from "@mui/material";
import {showSuccess} from "../../utils/toast.ts";

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
        await claimProduct(product.id);
        setProducts(prev =>
                prev.map(p =>
                    p.id === product.id
                        ? { ...p, ownerUsername: localStorage.getItem("username") }
                        : p
                )
        );
        showSuccess(`${product.name} has been added successfully.`);
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
                                    <EditButton onClick={() => handleClaimProduct(product)}>
                                        Add to My Orders
                                    </EditButton>
                                </ModuleTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}