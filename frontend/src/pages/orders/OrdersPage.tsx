import { useEffect, useState } from "react";
import { deleteOrder, fetchOrders, fetchAllUserOrders } from "../../api/backend";
import { useNavigate } from "react-router-dom";

import {
    ModulePageContainer,
    ModuleTableContainer
} from "../../ui/ModulePage.styles";

import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import type { OrderType } from "../../types/Order";
import type { InvoiceDTO } from "../../types/Invoice";
import { showSuccess, showError } from "../../utils/toast";

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [userOrders, setUserOrders] = useState<InvoiceDTO[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch both standard orders and user web orders when the page loads
        fetchOrders().then(setOrders).catch(e => console.error(e));

        fetchAllUserOrders()
            .then(setUserOrders)
            .catch(() => showError(new Error("Failed to load user orders.")));
    }, []);

    async function handleDelete(id: number) {
        await deleteOrder(id);
        setOrders(prev => prev.filter(o => o.id !== id));
        showSuccess("Order removed successfully.");
    }

    return (
        <ModulePageContainer>
            {/* --- 1. MANUAL ORDERS TABLE --- */}
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

            {/* --- 2. USER WEB ORDERS (INVOICES) TABLE --- */}
            <div style={{ marginTop: '50px' }}>
                {/* Reusing ModuleHeader but hiding the Add button since users create these */}
                <ModuleHeader
                    title="User Web Orders (Invoices)"
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

                        onEdit={(id) => console.log("View Invoice", id)}
                        onDelete={(id) => console.log("Cannot delete finalized invoices", id)}
                    />
                </ModuleTableContainer>
            </div>

        </ModulePageContainer>
    );
}