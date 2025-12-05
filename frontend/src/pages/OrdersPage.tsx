import { useEffect, useState } from "react";
import { fetchOrders } from "../api/backend";
import {
    StockPageContainer,
    StockTableContainer,
    StockTableHeader,
    StockBodyRow,
    StockTableCell,
    StockPageTitle,
} from "../styles/StockList.styles";
import { Table, TableHead, TableBody, TableRow } from "@mui/material";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders()
            .then(setOrders)
            .catch(() => setError("Could not load orders"));
    }, []);

    return (
        <StockPageContainer>
            <StockPageTitle>Orders</StockPageTitle>
            <StockTableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StockTableHeader>ID</StockTableHeader>
                            <StockTableHeader>Customer</StockTableHeader>
                            <StockTableHeader>Status</StockTableHeader>
                            <StockTableHeader>Responsible Employee</StockTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <StockBodyRow key={order.id}>
                                <StockTableCell>{order.id}</StockTableCell>
                                <StockTableCell>{order.customerName}</StockTableCell>
                                <StockTableCell>{order.status}</StockTableCell>
                                <StockTableCell>{order.responsibleEmployee?.firstName} {order.responsibleEmployee?.lastName}</StockTableCell>
                            </StockBodyRow>
                        ))}
                    </TableBody>
                </Table>
            </StockTableContainer>
            {error && <p style={{ textAlign: "center", color: "#a00" }}>{error}</p>}
        </StockPageContainer>
    );
}
