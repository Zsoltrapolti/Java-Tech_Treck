import { useEffect, useState } from "react";
import { deleteOrder, fetchOrders } from "../../api/backend";
import { useNavigate } from "react-router-dom";

import {
    ModulePageContainer,
    ModuleTableContainer
} from "../../ui/ModulePage.styles";

import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import type { OrderType } from "../../types/Order";

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders().then(setOrders);
    }, []);

    async function handleDelete(id: number) {
        await deleteOrder(id);
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
        </ModulePageContainer>
    );
}
