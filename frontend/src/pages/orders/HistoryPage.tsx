import { useEffect, useState } from 'react';
import { fetchMyOrderHistory, fetchMyPaymentHistory } from '../../api/backend';
import type { InvoiceDTO, PaymentDTO } from '../../types/Invoice';

import {
    ModulePageContainer,
    ModulePageHeader,
    ModuleTableContainer,
    ModuleSectionWrapper,
    ModuleSectionTitle,
    EmptyStateBox,
    StatusMessage
} from "../../ui/ModulePage.styles";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";

type ExtendedOrder = InvoiceDTO & { date?: string; number?: string; totalGross?: number; status?: string; id?: number };
type ExtendedPayment = PaymentDTO & { date?: string; transactionId?: string; method?: string; amount?: number; status?: string; id?: number };

export function HistoryPage() {
    const [orders, setOrders] = useState<InvoiceDTO[]>([]);
    const [payments, setPayments] = useState<PaymentDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [ordersData, paymentsData] = await Promise.all([
                    fetchMyOrderHistory(),
                    fetchMyPaymentHistory()
                ]);

                setOrders(Array.isArray(ordersData) ? ordersData : []);
                setPayments(Array.isArray(paymentsData) ? paymentsData : []);
            } catch (err) {
                setError((err as Error).message || "Failed to load history data.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) return <StatusMessage>Loading your history...</StatusMessage>;
    if (error) return <StatusMessage error>Error: {error}</StatusMessage>;

    return (
        <ModulePageContainer sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ModulePageHeader>My History</ModulePageHeader>

            <ModuleSectionWrapper>
                <ModuleSectionTitle>Order History</ModuleSectionTitle>
                {orders.length === 0 ? (
                    <EmptyStateBox>You have no past orders.</EmptyStateBox>
                ) : (
                    <ModuleTableContainer>
                        <ModuleDataTable
                            rows={orders.map((order: ExtendedOrder, index) => ({
                                id: order.id || index,
                                date: order.date ? new Date(order.date).toLocaleDateString() : 'N/A',
                                orderNumber: order.number || 'N/A',
                                total: `$${Number(order.totalGross || 0).toFixed(2)}`,
                                status: order.status || 'UNKNOWN'
                            }))}
                            columns={[
                                { label: "Date", key: "date" },
                                { label: "Order Number", key: "orderNumber" },
                                { label: "Total Gross", key: "total" },
                                { label: "Status", key: "status" }
                            ]}
                        />
                    </ModuleTableContainer>
                )}
            </ModuleSectionWrapper>

            <ModuleSectionWrapper>
                <ModuleSectionTitle>Payment History</ModuleSectionTitle>
                {payments.length === 0 ? (
                    <EmptyStateBox>You have no past payments.</EmptyStateBox>
                ) : (
                    <ModuleTableContainer>
                        <ModuleDataTable
                            rows={payments.map((payment: ExtendedPayment, index) => ({
                                id: payment.id || index,
                                date: payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A',
                                transactionId: payment.transactionId || 'N/A',
                                method: payment.method || 'N/A',
                                amount: `$${Number(payment.amount || 0).toFixed(2)}`,
                                status: payment.status || 'UNKNOWN'
                            }))}
                            columns={[
                                { label: "Date", key: "date" },
                                { label: "Transaction ID", key: "transactionId" },
                                { label: "Method", key: "method" },
                                { label: "Amount", key: "amount" },
                                { label: "Status", key: "status" }
                            ]}
                        />
                    </ModuleTableContainer>
                )}
            </ModuleSectionWrapper>
        </ModulePageContainer>
    );
}