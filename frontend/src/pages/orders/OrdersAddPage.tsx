import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder, fetchEmployees } from "../../api/backend.ts";

import { EditFormPage } from "../../components/form/EditFormPage.tsx";
import { EditFormField } from "../../components/form/EditFormField.tsx";
import { EditFormActions } from "../../components/form/EditFormActions.tsx";

import { EditSelect } from "../../ui/ModulePageEdit.styles.ts";

import type { EmployeeType } from "../../types/Employee.ts";
import type { OrderType } from "../../types/Order.ts";
import { MenuItem } from "@mui/material";

export default function OrdersAddPage() {
    const navigate = useNavigate();

    const [order, setOrder] = useState<OrderType>({
        id: 0,
        customerName: "",
        status: "",
        creationDate: new Date(),
        responsibleEmployee: null,
    });

    const [employees, setEmployees] = useState<EmployeeType[]>([]);

    useEffect(() => {
        fetchEmployees().then(setEmployees);
    }, []);

    return (
        <EditFormPage title="Add Order">

            <EditFormField
                label="Customer Name"
                value={order.customerName}
                onChange={v => setOrder({ ...order, customerName: v })}
            />

            <EditFormField
                label="Status"
                value={order.status}
                onChange={v => setOrder({ ...order, status: v })}
            />

            <label style={{ fontWeight: 600 }}>Responsible Employee</label>
            <EditSelect
                select
                value={order.responsibleEmployee?.id || ""}
                onChange={(e) => {
                    const emp = employees.find(x => x.id === Number(e.target.value));
                    setOrder({ ...order, responsibleEmployee: emp || null });
                }}
            >
                <MenuItem value=""><em>Select employee</em></MenuItem>
                {employees.map(emp => (
                    <MenuItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                    </MenuItem>
                ))}
            </EditSelect>

            <EditFormActions
                onSave={async () => {
                    await createOrder(order);
                    navigate("/orders");
                }}
                onCancel={() => navigate("/orders")}
            />

        </EditFormPage>
    );
}
