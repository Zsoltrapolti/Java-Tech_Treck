import { useEffect, useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    Chip,
    CircularProgress,
    Typography,
    Container,
    Paper
} from "@mui/material";

import { fetchOrders } from "../../api/backend";
import { ModulePageContainer, ModulePageHeader, ModuleTableContainer, ModuleTableHeader, ModuleTableCell } from "../../ui/ModulePage.styles";
import type { OrderType } from "../../types/Order";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    const currentUserId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        fetchOrders()
            .then((data) => {
                const myUsername = localStorage.getItem("username");
                                const myOrders = data.filter(o => o.customerName === myUsername);

                                myOrders.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

                                setOrders(myOrders);
                                setLoading(false);

            });
    }, [currentUserId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DONE': return 'success';
            case 'PENDING': return 'warning';
            case 'UPCOMING': return 'info';
            default: return 'default';
        }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>My Order History</ModulePageHeader>

            {orders.length === 0 ? (
                <Container maxWidth="sm">
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', marginTop: '20px' }}>
                        <Typography variant="h6">
                            You haven't placed any orders yet.
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Go to "Create Order" to start!
                        </Typography>
                    </Paper>
                </Container>
            ) : (
                <ModuleTableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <ModuleTableHeader>Order ID</ModuleTableHeader>
                                <ModuleTableHeader>Date Created</ModuleTableHeader>
                                <ModuleTableHeader>Status</ModuleTableHeader>
                                <ModuleTableHeader>Items</ModuleTableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <ModuleTableCell>#{order.id}</ModuleTableCell>
                                    <ModuleTableCell>
                                        {new Date(order.creationDate).toLocaleString()}
                                    </ModuleTableCell>
                                    <ModuleTableCell>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status) as any}
                                            variant="filled"
                                            size="small"
                                            style={{ fontWeight: 'bold' }}
                                        />
                                    </ModuleTableCell>
                                    <ModuleTableCell>
                                        {order.items.length} Product(s)
                                    </ModuleTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ModuleTableContainer>
            )}
        </ModulePageContainer>
    );
}