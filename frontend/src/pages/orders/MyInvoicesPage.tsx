import { useEffect, useState } from "react";
import { fetchMyOrderHistory, fetchInvoiceDetails, generateAndOpenPdf } from "../../api/backend";
import { ModulePageContainer, ModuleTableContainer } from "../../ui/ModulePage.styles";
import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import type { InvoiceDTO } from "../../types/Invoice";
import { showError } from "../../utils/toast";

export default function MyInvoicesPage() {
    const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);

    useEffect(() => {
        fetchMyOrderHistory()
            .then(setInvoices)
            .catch(() => showError(new Error("Failed to load invoices.")));
    }, []);

    async function handleViewInvoice(id: number) {
        try {
            const invoiceDetails = await fetchInvoiceDetails(id);
            await generateAndOpenPdf(invoiceDetails);
        } catch (error) {
            showError(new Error("Failed to open invoice PDF."));
        }
    }

    return (
        <ModulePageContainer>
            <ModuleHeader
                title="My Invoices"
                addLabel=""
                onAdd={() => {}}
            />

            <ModuleTableContainer>
                <ModuleDataTable
                    rows={invoices.map(inv => ({
                        id: inv.id as number,
                        orderNumber: inv.number || 'N/A',
                        total: `$${Number(inv.totalGross || 0).toFixed(2)}`,
                        status: inv.status || 'UNKNOWN'
                    }))}
                    columns={[
                        { label: "ID", key: "id" },
                        { label: "Order Number", key: "orderNumber" },
                        { label: "Total Gross", key: "total" },
                        { label: "Status", key: "status" }
                    ]}

                    onEdit={handleViewInvoice}
                    editLabel="View Invoice"
                />
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}