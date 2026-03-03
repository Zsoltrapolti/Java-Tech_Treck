import { useEffect, useState } from "react";
import {deleteOrder, fetchOrders, fetchAllUserOrders, fetchInvoiceById} from "../../api/backend";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/form/AuthContext"; // ✅ ADAUGĂ ASTA

import {
    ModulePageContainer,
    ModuleTableContainer
} from "../../ui/ModulePage.styles";

import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import type { OrderType } from "../../types/Order";
import type { InvoiceDTO } from "../../types/Invoice";
import { showSuccess, showError } from "../../utils/toast";

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [userOrders, setUserOrders] = useState<InvoiceDTO[]>([]);
    const navigate = useNavigate();
    const { role } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        fetchOrders().then(setOrders).catch(e => console.error(e));

        if (role === "EMPLOYEE" || role === "ADMIN") {
            fetchAllUserOrders()
                .then(setUserOrders)
                .catch(() => showError(new Error("Failed to load user orders.")));
        }
    }

    async function handleDelete(id: number) {
        await deleteOrder(id);
        setOrders(prev => prev.filter(o => o.id !== id));
        showSuccess("Order removed successfully.");
    }

    async function handleEditUserOrder(id: number) {
        try {
            const invoice = await fetchInvoiceById(id);

            if (invoice.status === 'PENDING_PAYMENT') {
                navigate(`/user-orders/${id}/edit`);
            } else {
                const statusMessages: Record<string, string> = {
                    'PAID': `Order #${invoice.number} has been paid and cannot be edited.`,
                    'CANCELLED': `Order #${invoice.number} has been cancelled and cannot be edited.`,
                    'OVERDUE': `Order #${invoice.number} is overdue and cannot be edited.`
                };

                const message = statusMessages[invoice.status] ||
                    `Cannot edit order #${invoice.number} with status: ${invoice.status}. Only PENDING_PAYMENT orders can be modified.`;

                showError(new Error(message));
            }
        } catch (error) {
            showError(new Error("Failed to load invoice details."));
            console.error(error);
        }
    }

    return (
        <ModulePageContainer>
            {(role === "EMPLOYEE" || role === "ADMIN") && (
                <>
                    <ModuleHeader
                        title="Clients Orders"
                        addLabel=""
                        onAdd={() => {}}
                    />

                    <ModuleTableContainer>
                        <ModuleDataTable
                            rows={userOrders.map(o => ({
                                id: o.id as number,
                                orderNumber: o.number || 'N/A',
                                customerName: o.clientName || 'N/A',
                                total: `$${Number(o.totalGross || 0).toFixed(2)}`,
                                status: o.status || 'UNKNOWN'
                            }))}

                            columns={[
                                { label: "ID", key: "id" },
                                { label: "Order Number", key: "orderNumber" },
                                { label: "Customer", key: "customerName" },
                                { label: "Total Gross", key: "total" },
                                { label: "Status", key: "status" }
                            ]}
                            onEdit={handleEditUserOrder}
                            onDelete={(id) => console.log("Cannot delete finalized invoices", id)}
                        />
                    </ModuleTableContainer>

                    <div style={{ marginTop: "50px" }} />
                </>
            )}

            {role === "ADMIN" && (
                <>
                    <ModuleHeader
                        title="Manual Employee Orders"
                        addLabel="Add Order"
                        onAdd={() => navigate("/orders/new")}
                    />

                    <ModuleTableContainer>
                        <ModuleDataTable
                            rows={orders
                                .filter(o => o.id !== undefined)
                                .map(o => ({
                                    id: o.id as number,
                                    customerName: o.customerName,
                                    responsibleEmployeeId: o.responsibleEmployeeId,
                                }))
                            }

                            columns={[
                                { label: "ID", key: "id" },
                                { label: "Customer", key: "customerName" },
                                { label: "Employee ID", key: "responsibleEmployeeId" },
                            ]}

                            onEdit={(id) => navigate(`/orders/${id}/edit`)}
                            onDelete={handleDelete}
                        />
                    </ModuleTableContainer>
                </>
            )}
        </ModulePageContainer>
    );
}
