import { useEffect, useState } from "react";
import { deleteOrder, fetchOrders } from "../../api/backend.ts";
import { useNavigate } from "react-router-dom";

import {
    ModulePageContainer,
    ModuleTableContainer
} from "../../ui/ModulePage.styles.ts";

import { ModuleHeader } from "../../components/table/ModuleHeader.tsx";
import { ModuleDataTable } from "../../components/table/ModuleDataTable.tsx";
import type { OrderType } from "../../types/Order.ts";

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders().then(setOrders);
    }, []);

    function handleDelete(id: number) {
        deleteOrder(id);
        setOrders(prev => prev.filter(o => o.id !== id));
    }

    return (
        <ModulePageContainer>

            <ModuleHeader
                title="Orders"
                addLabel="Add Order"
                onAdd={() => navigate("/orders/new")}
            />

            <ModuleTableContainer>
                <ModuleDataTable
                    rows={orders.map(o => ({
                        id: o.id,
                        customerName: o.customerName,
                        status: o.status,
                        responsibleEmployee: o.responsibleEmployee
                            ? `${o.responsibleEmployee.firstName} ${o.responsibleEmployee.lastName}`
                            : "—"
                    }))}

                    columns={[
                        { label: "ID", key: "id" },
                        { label: "Customer", key: "customerName" },
                        { label: "Status", key: "status" },
                        { label: "Responsible Employee", key: "responsibleEmployee" },
                    ]}

                    onEdit={id => navigate(`/orders/${id}/edit`)}
                    onDelete={handleDelete}
                />
            </ModuleTableContainer>

        </ModulePageContainer>
    );
}
