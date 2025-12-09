import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrderById, updateOrder, fetchEmployees } from "../api/backend";

import {
    EditContainer,
    EditCard,
    EditTitle,
    EditLabel,
    EditInput,
    SaveButton,
    BackButton,
    EditSelect
} from "../styles/StockEdit.styles";

import { MenuItem } from "@mui/material";
import type { OrderType } from "../types/Order";
import type { EmployeeType } from "../types/Employee";

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

    function handleChange(field: keyof OrderType, value: any) {
        if (!order) return;
        setOrder({ ...order, [field]: value });
    }

    async function handleSave() {
        if (!order) return;

        try {
            await updateOrder(order);
            navigate("/orders");
        } catch {
            alert("Failed to update order");
        }
    }

    if (!order) {
        return <p>Loading...</p>;
    }

    return (
        <EditContainer>
            <EditCard elevation={6}>
                <EditTitle>Edit Order</EditTitle>

                <EditLabel>Customer Name</EditLabel>
                <EditInput
                    value={order.customerName}
                    onChange={(e) => handleChange("customerName", e.target.value)}
                />

                <EditLabel>Status</EditLabel>
                <EditInput
                    value={order.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                />

                <EditLabel>Responsible Employee</EditLabel>

                <EditSelect
                    select
                    value={order.responsibleEmployee?.id || ""}
                    onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        const selected = employees.find(emp => emp.id === selectedId);
                        handleChange("responsibleEmployee", selected || null);
                    }}
                >
                <MenuItem value="">
                        <em>Select employee</em>
                    </MenuItem>

                    {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                        </MenuItem>
                    ))}
                </EditSelect>

                <SaveButton variant="contained" onClick={handleSave}>
                    Save
                </SaveButton>

                <BackButton variant="contained" onClick={() => navigate("/orders")}>
                    Cancel
                </BackButton>
            </EditCard>
        </EditContainer>
    );
}
