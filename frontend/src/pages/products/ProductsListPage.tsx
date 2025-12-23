import { useEffect, useState } from "react";
import { fetchProducts } from "../../api/backend";
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
           console.log("Fetching global menu...");
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
                            <ModuleTableHeader>Type</ModuleTableHeader>
                            <ModuleTableHeader>Unit</ModuleTableHeader>
                            <ModuleTableHeader>In Stock</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map(product => (
                                <TableRow key={product.id}>
                                    <ModuleTableCell>{product.id}</ModuleTableCell>
                                    <ModuleTableCell>{product.name}</ModuleTableCell>
                                    <ModuleTableCell>{product.type}</ModuleTableCell>
                                    <ModuleTableCell>{product.unitOfMeasure}</ModuleTableCell>
                                    <ModuleTableCell>{product.quantity}</ModuleTableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <ModuleTableCell colSpan={5} style={{ textAlign: 'center' }}>
                                    No products found in the database.
                                </ModuleTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}