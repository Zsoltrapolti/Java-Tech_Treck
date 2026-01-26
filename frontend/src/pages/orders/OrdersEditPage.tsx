import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    fetchOrderById,
    fetchEmployees,
    updateOrder,
} from "../../api/backend";

import { EditFormPage } from "../../components/form/EditFormPage";
import { EditFormField } from "../../components/form/EditFormField";
import { EditFormActions } from "../../components/form/EditFormActions";

import {
    EditLabel,
    EditSelect,
    OrderItemRow,
} from "../../ui/ModulePageEdit.styles";

import type { EmployeeType } from "../../types/Employee";
import type { OrderType } from "../../types/Order";

import { MenuItem } from "@mui/material";
import { showError } from "../../utils/toast";

export default function OrdersEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<OrderType | null>(null);
    const [employees, setEmployees] = useState<EmployeeType[]>([]);

    useEffect(() => {
        if (!id) return;

        fetchOrderById(Number(id)).then(setOrder);
        fetchEmployees().then(setEmployees);
    }, [id]);

    if (!order) return null;

    async function handleSave() {
        try {
            if(order == null)
                throw new Error("Order is null");

            if (!order.responsibleEmployeeId) {
                throw new Error("Responsible employee is required");
            }

            await updateOrder({
                id: order.id,
                customerName: order.customerName,
                responsibleEmployeeId: order.responsibleEmployeeId,
                items: order.items,
            });

            navigate("/orders");
        } catch (e) {
            showError(e);
        }
    }

    return (
            <EditFormPage title={`Edit Order #${order.id}`}>
                <EditFormField label="Customer Name" value={order.customerName} disabled />

                {/* Admin can change Status, mai vad cum trebuie implementat asta*/}
                <EditLabel>Order Status</EditLabel>
                <EditSelect
                    select
                    value={order.status}
                    onChange={e => setOrder({ ...order, status: e.target.value as OrderStatus })}
                >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="UPCOMING">Upcoming</MenuItem>
                    <MenuItem value="DONE">Done</MenuItem>
                </EditSelect>

                <EditLabel>Responsible Employee</EditLabel>
                <EditSelect
                    select
                    value={order.responsibleEmployeeId ?? ""}
                    onChange={e => setOrder({ ...order, responsibleEmployeeId: Number(e.target.value) })}
                >
                    {employees.map(emp => (
                        <MenuItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                        </MenuItem>
                    ))}
                </EditSelect>

            <EditLabel>Items (read-only)</EditLabel>
            {order.items.map((item, i) => (
                <OrderItemRow key={i}>
                    <EditFormField
                        label="Product ID"
                        value={item.productId}
                        disabled
                    />
                    <EditFormField
                        label="Quantity"
                        value={item.quantity}
                        disabled
                    />
                    <EditFormField
                        label="Unit Price"
                        value={item.unitPrice}
                        disabled
                    />
                </OrderItemRow>
            ))}

            <EditFormActions
                onSave={handleSave}
                onCancel={() => navigate("/orders")}
            />
        </EditFormPage>
    );
}
