import { useEffect, useState } from "react";
import { fetchMyProducts } from "../../api/backend";
import type { ProductType } from "../../types/Product";
import { ModulePageContainer, ModuleTableContainer, ModulePageHeader, ModuleTableHeader, ModuleTableCell } from "../../ui/ModulePage.styles";
import { Table, TableHead, TableRow, TableBody } from "@mui/material";

export default function MyProductsListPage() {
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        fetchMyProducts()
            .then(setProducts)
            .catch(err => console.error("Error loading your personal menu:", err));
    }, []);

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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p.id}>
                                <ModuleTableCell>{p.name}</ModuleTableCell>
                                <ModuleTableCell>{p.unitOfMeasure}</ModuleTableCell>
                                <ModuleTableCell>{p.quantity}</ModuleTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}