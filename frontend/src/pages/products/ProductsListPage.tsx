import { useEffect, useState } from "react";
import { fetchProducts } from "../../api/backend";

import type { ProductType } from "../../types/Product";

import {
    ModulePageContainer,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell,
} from '../../ui/ModulePage.styles';

import {
    Table,
    TableHead,
    TableRow,
    TableBody
} from "@mui/material";
import {ModulePageHeader} from "../../ui/ModulePage.styles.ts";

export default function ProductsListPage() {
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    return (
        <ModulePageContainer>

            <ModulePageHeader>
                Products
            </ModulePageHeader>

            <ModuleTableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <ModuleTableHeader>ID</ModuleTableHeader>
                            <ModuleTableHeader>Name</ModuleTableHeader>
                            <ModuleTableHeader>Type</ModuleTableHeader>
                            <ModuleTableHeader>Unit</ModuleTableHeader>
                            <ModuleTableHeader>Quantity</ModuleTableHeader>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.id}>
                                <ModuleTableCell>{product.id}</ModuleTableCell>
                                <ModuleTableCell>{product.name}</ModuleTableCell>
                                <ModuleTableCell>{product.type}</ModuleTableCell>
                                <ModuleTableCell>{product.unitOfMeasure}</ModuleTableCell>
                                <ModuleTableCell>{product.quantity}</ModuleTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModuleTableContainer>

        </ModulePageContainer>
    );
}
