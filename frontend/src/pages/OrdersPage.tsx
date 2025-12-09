import { useEffect, useState } from "react";
import { fetchOrders } from "../api/backend";
import { useNavigate } from "react-router-dom";

import {
    BackButton,
    StockPageContainer,
    StockPageTitle,
    StockPaper,
    StockTableContainer,
    StockTableHeader,
    StockBodyRow,
    StockTableCell, EditButton,
} from "../styles/StockList.styles";

import { Table, TableBody, TableHead, TableRow } from "@mui/material";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders()
            .then(setOrders)
    }, []);

    return (
        <StockPageContainer>
            <BackButton variant="contained" onClick={() => navigate("/home")}>
                Back to Home
            </BackButton>

            <StockPaper>
                <StockPageTitle>Orders</StockPageTitle>

                <StockTableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StockTableHeader>ID</StockTableHeader>
                                <StockTableHeader>Customer</StockTableHeader>
                                <StockTableHeader>Status</StockTableHeader>
                                <StockTableHeader>Responsible Employee</StockTableHeader>
                                <StockTableHeader>Edit</StockTableHeader>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {orders.map((order) => (
                                <StockBodyRow key={order.id}>
                                    <StockTableCell>{order.id}</StockTableCell>
                                    <StockTableCell>{order.customerName}</StockTableCell>
                                    <StockTableCell>{order.status}</StockTableCell>
                                    <StockTableCell>
                                        {order.responsibleEmployee
                                            ? `${order.responsibleEmployee.firstName} ${order.responsibleEmployee.lastName}`
                                            : "—"
                                        }
                                    </StockTableCell>
                                    <StockTableCell>
                                        <EditButton variant="contained" onClick={() => navigate(`/orders/${order.id}/edit`)}>
                                            Edit
                                        </EditButton>
                                    </StockTableCell>
                                </StockBodyRow>
                            ))}
                        </TableBody>
                    </Table>
                </StockTableContainer>
            </StockPaper>
        </StockPageContainer>
    );
}
