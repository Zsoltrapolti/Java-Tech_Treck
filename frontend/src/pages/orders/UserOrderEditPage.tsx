import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchInvoiceById, modifyClientOrder } from "../../api/backend";

import { EditFormPage } from "../../components/form/EditFormPage";
import { EditFormField } from "../../components/form/EditFormField";
import { EditFormActions } from "../../components/form/EditFormActions";

import type { InvoiceDTO } from "../../types/Invoice";
import { showSuccess, showError } from "../../utils/toast";

export default function UserOrderEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState<InvoiceDTO | null>(null);
    const [editForm, setEditForm] = useState({ cardHolderName: '', street: '', city: '', county: '', zip: '' });

    const [employeeId, setEmployeeId] = useState<number | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) {
            setEmployeeId(Number(storedId));
        } else {
            showError("Could not identify the logged-in employee!");
        }
    }, []);

    useEffect(() => {
        if (!id) return;

        fetchInvoiceById(Number(id)).then(inv => {
            setInvoice(inv);

            const addrParts = inv.clientAddress ? inv.clientAddress.split(', ') : ['', '', '', ''];
            setEditForm({
                cardHolderName: inv.clientName || '',
                street: addrParts[0] || '',
                city: addrParts[1] || '',
                county: addrParts[2] || '',
                zip: addrParts[3] || ''
            });
        }).catch(e => {
            showError("An error occurred while loading the invoice details.");
            console.error(e);
        });
    }, [id]);


    if (!employeeId) return <p style={{ padding: '20px' }}>Loading employee data...</p>;
    if (!invoice) return <p style={{ padding: '20px' }}>Loading invoice details...</p>;

    async function handleSave() {
        try {
            if (invoice?.status !== 'PENDING_PAYMENT') {
                throw new Error("You can only edit orders with PENDING_PAYMENT status!");
            }

            await modifyClientOrder(Number(id), editForm);
            showSuccess("Order updated successfully!");
            navigate("/orders");
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Error updating order");
            }
        }
    }


    return (
        <EditFormPage title={`Edit Web Order #${invoice.number}`}>

            <EditFormField
                label="Status"
                value={invoice.status || 'UNKNOWN'}
                disabled
            />

            <div style={{ marginTop: '20px', marginBottom: '10px', color: '#1e5b32', fontWeight: 'bold' }}>
                Billing & Shipping Details
            </div>

            <EditFormField
                label="Client Name"
                value={editForm.cardHolderName}
                onChange={v => setEditForm({ ...editForm, cardHolderName: v })}
            />
            <EditFormField
                label="Street"
                value={editForm.street}
                onChange={v => setEditForm({ ...editForm, street: v })}
            />
            <EditFormField
                label="City"
                value={editForm.city}
                onChange={v => setEditForm({ ...editForm, city: v })}
            />
            <EditFormField
                label="County"
                value={editForm.county}
                onChange={v => setEditForm({ ...editForm, county: v })}
            />
            <EditFormField
                label="Zip Code"
                value={editForm.zip}
                onChange={v => setEditForm({ ...editForm, zip: v })}
            />

            <EditFormActions
                onSave={handleSave}
                onCancel={() => navigate("/orders")}
            />
        </EditFormPage>
    );
}