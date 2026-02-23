/* --- MyOrdersPage.tsx (Optimized) --- */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableRow, TableBody, Chip, CircularProgress, Button } from "@mui/material";
import { fetchOrders } from "../../api/backend";
import {
    ModulePageContainer,
    ModulePageHeader,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell
} from "../../ui/ModulePage.styles";
import type { OrderType } from "../../types/Order";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const myUsername = localStorage.getItem("username");
        fetchOrders()
            .then((data) => {
                // Filter and Sort by date descending
                const myOrders = data
                    .filter(o => o.customerName === myUsername)
                    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

                setOrders(myOrders);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'DONE': return 'success';
            case 'PENDING': return 'warning';
            case 'PAID': return 'info';
            default: return 'default';
        }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '40px auto', color: '#2C6E49' }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>My Order History</ModulePageHeader>
            <ModuleTableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <ModuleTableHeader>Order ID</ModuleTableHeader>
                            <ModuleTableHeader>Date Created</ModuleTableHeader>
                            <ModuleTableHeader>Status</ModuleTableHeader>
                            <ModuleTableHeader>Items Count</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <ModuleTableCell colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>
                                    You haven't placed any orders yet.
                                    <Button onClick={() => navigate("/products")} style={{ marginLeft: '10px', color: '#2C6E49' }}>
                                        Start Shopping
                                    </Button>
                                </ModuleTableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <ModuleTableCell><strong>#{order.id}</strong></ModuleTableCell>
                                    <ModuleTableCell>
                                        {new Date(order.creationDate).toLocaleString('ro-RO')}
                                    </ModuleTableCell>
                                    <ModuleTableCell>
                                        <Chip
                                            label={order.status || "PENDING"}
                                            color={getStatusColor(order.status) as any}
                                            size="small"
                                        />
                                    </ModuleTableCell>
                                    <ModuleTableCell>{order.items?.length || 0} Items</ModuleTableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}