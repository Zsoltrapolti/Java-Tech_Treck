import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchOrderById, updateOrder, fetchEmployees } from "../api/backend.ts";

import { EditFormPage } from "../components/EditFormPage.tsx";
import { EditFormField } from "../components/EditFormField.tsx";
import { EditFormActions } from "../components/EditFormActions.tsx";

import { EditSelect } from "../styles/ModulePageEdit.styles.ts";

import type { OrderType } from "../types/Order.ts";
import type { EmployeeType } from "../types/Employee.ts";
import { MenuItem } from "@mui/material";

export default function OrdersEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<OrderType | null>(null);
    const [employees, setEmployees] = useState<EmployeeType[]>([]);

    useEffect(() => {
        if (id) {
            fetchOrderById(Number(id)).then(setOrder);
            fetchEmployees().then(setEmployees);
        }
    }, [id]);

    if (!order) return <p>Loading...</p>;

    return (
        <EditFormPage title="Edit Order">

            <EditFormField
                label="Customer Name"
                value={order.customerName}
                onChange={(v) => setOrder({ ...order, customerName: v })}
            />

            <EditFormField
                label="Status"
                value={order.status}
                onChange={(v) => setOrder({ ...order, status: v })}
            />

            <>
                <label style={{ fontWeight: 600, color: "#1c3d2c" }}>Responsible Employee</label>
                <EditSelect
                    select
                    value={order.responsibleEmployee?.id || ""}
                    onChange={(e) => {
                        const selected = employees.find(emp => emp.id === Number(e.target.value));
                        setOrder({ ...order, responsibleEmployee: selected || null });
                    }}
                >
                <MenuItem value="">
                        <em>Select employee</em>
                    </MenuItem>

                    {employees.map(emp => (
                        <MenuItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                        </MenuItem>
                    ))}
                </EditSelect>
            </>

            <EditFormActions
                onSave={async () => {
                    await updateOrder(order);
                    navigate("/orders");
                }}
                onCancel={() => navigate("/orders")}
            />

        </EditFormPage>
    );
}
