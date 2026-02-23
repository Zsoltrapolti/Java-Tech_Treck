import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { createOrder, fetchEmployees } from "../../api/backend";
import { EditFormPage } from "../../components/form/EditFormPage";
import { EditFormField } from "../../components/form/EditFormField";
import { EditFormActions } from "../../components/form/EditFormActions";
import {
    AddItemButton,
    EditLabel,
    EditSelect,
    OrderItemRow
} from "../../ui/ModulePageEdit.styles";
import { showError } from "../../utils/toast";
import { MenuItem } from "@mui/material";


import type { EmployeeType } from "../../types/Employee";
import type { OrderType } from "../../types/Order";
import type { OrderItemType } from "../../types/OrderItem";

export default function OrdersAddPage() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState<EmployeeType[]>([]);

    const [order, setOrder] = useState<OrderType>({
        customerName: "",
        responsibleEmployeeId: 0,
        items: [],
    });

    useEffect(() => {
        fetchEmployees()
            .then((data) => {
                console.log("Employees fetched:", data);
                setEmployees(data);
            })
            .catch((err) => {
                console.error(err);
                showError(new Error("Could not load employees"));
            });
    }, []);

    function addItem() {
        setOrder(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { productId: 0, quantity: 1, unitPrice: 1 },
            ],
        }));
    }

    function updateItem(
        index: number,
        field: keyof OrderItemType,
        value: number
    ) {
        const items = [...order.items];
        items[index] = { ...items[index], [field]: value };
        setOrder({ ...order, items });
    }

    async function handleSave() {
        try {
            if (!order.customerName.trim()) {
                throw new Error("Customer name is required");
            }
            if (!order.responsibleEmployeeId) {
                throw new Error("Responsible employee is required");
            }

            await createOrder(order);
            navigate("/orders");
        } catch (e: any) {
            showError(e);
        }
    }

    return (
        <EditFormPage title="Add Order">
            <EditFormField
                label="Customer Name"
                value={order.customerName}
                onChange={v =>
                    setOrder({ ...order, customerName: v })
                }
            />

            <EditLabel>Responsible Employee</EditLabel>
            <EditSelect
                select
                value={order.responsibleEmployeeId || ""}
                onChange={(e: any) =>
                    setOrder({
                        ...order,
                        responsibleEmployeeId: Number(e.target.value),
                    })
                }
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

            <EditLabel>Items</EditLabel>

            {order.items.map((item, i) => (
                <OrderItemRow key={i}>
                    <EditFormField
                        label="Product ID"
                        value={item.productId}
                        onChange={v =>
                            updateItem(i, "productId", Number(v))
                        }
                    />
                    <EditFormField
                        label="Quantity"
                        value={item.quantity}
                        onChange={v =>
                            updateItem(i, "quantity", Number(v))
                        }
                    />
                    <EditFormField
                        label="Unit Price"
                        value={item.unitPrice}
                        onChange={v =>
                            updateItem(i, "unitPrice", Number(v))
                        }
                    />
                </OrderItemRow>
            ))}

            <AddItemButton onClick={addItem}>
                + Add item
            </AddItemButton>

            <EditFormActions
                onSave={handleSave}
                onCancel={() => navigate("/orders")}
            />
        </EditFormPage>
    );
}