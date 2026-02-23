import React, { useEffect, useState } from 'react';
import { fetchMyOrderHistory, fetchMyPaymentHistory } from '../../api/backend';
import type { PaymentDTO } from '../../api/backend';
import type { InvoiceDTO } from '../../types/Invoice';

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
            } catch (err: any) {
                setError(err.message || "Failed to load history data.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // --- Standard React Styles ---
    const styles = {
        container: { maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
        pageTitle: { color: '#1e5b32', fontSize: '32px', borderBottom: '3px solid #1e5b32', paddingBottom: '10px', marginBottom: '30px' },
        sectionTitle: { color: '#333', fontSize: '24px', marginBottom: '15px', marginTop: '40px' },
        tableWrapper: { borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #ddd', backgroundColor: 'white' },
        table: { width: '100%', borderCollapse: 'collapse' as const },
        th: { backgroundColor: '#1e5b32', color: 'white', padding: '15px', textAlign: 'left' as const, fontSize: '16px' },
        td: { padding: '15px', borderBottom: '1px solid #eee', color: '#444', fontSize: '15px' },
        badgePaid: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid #c8e6c9', display: 'inline-block' },
        badgeOther: { backgroundColor: '#fff3e0', color: '#ef6c00', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid #ffe0b2', display: 'inline-block' },
        emptyBox: { padding: '20px', backgroundColor: '#f9f9f9', fontStyle: 'italic', color: '#666', border: '1px solid #ddd', borderRadius: '8px' }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px', color: '#1e5b32' }}>Loading your history...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px', color: 'red' }}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>My History</h1>

            {/* --- ORDERS (INVOICES) TABLE --- */}
            <section>
                <h2 style={styles.sectionTitle}>Order History</h2>
                {orders.length === 0 ? (
                    <div style={styles.emptyBox}>You have no past orders.</div>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Order Number</th>
                                    <th style={styles.th}>Total Gross</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id || index}>
                                        <td style={styles.td}>{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                                        <td style={{...styles.td, fontFamily: 'monospace'}}>{order.number || 'N/A'}</td>
                                        <td style={{...styles.td, fontWeight: 'bold'}}>${Number(order.totalGross || 0).toFixed(2)}</td>
                                        <td style={styles.td}>
                                            <span style={order.status === 'PAID' ? styles.badgePaid : styles.badgeOther}>
                                                {order.status || 'UNKNOWN'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* --- PAYMENTS TABLE --- */}
            <section>
                <h2 style={styles.sectionTitle}>Payment History</h2>
                {payments.length === 0 ? (
                    <div style={styles.emptyBox}>You have no past payments.</div>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Transaction ID</th>
                                    <th style={styles.th}>Method</th>
                                    <th style={styles.th}>Amount</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment, index) => (
                                    <tr key={payment.id || index}>
                                        <td style={styles.td}>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</td>
                                        <td style={{...styles.td, fontFamily: 'monospace'}}>{payment.transactionId || 'N/A'}</td>
                                        <td style={styles.td}>{payment.method || 'N/A'}</td>
                                        <td style={{...styles.td, fontWeight: 'bold'}}>${Number(payment.amount || 0).toFixed(2)}</td>
                                        <td style={styles.td}>
                                            <span style={payment.status === 'PAID' ? styles.badgePaid : styles.badgeOther}>
                                                {payment.status || 'UNKNOWN'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}