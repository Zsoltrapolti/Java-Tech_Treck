import { useState, useEffect } from "react";
import { fetchClientBalance, fetchAccounts, fetchInvoiceDetails, generateAndOpenPdf } from "../../api/backend";
import { ModulePageContainer, ModuleTableContainer } from "../../ui/ModulePage.styles";
import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import { showError } from "../../utils/toast";

export default function ClientBalancePage() {
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | "">("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [balanceData, setBalanceData] = useState<any | null>(null);

    useEffect(() => {
        fetchAccounts()
            .then(data => {
                const onlyUsers = data.filter((acc: any) => acc.role === "USER");
                setClients(onlyUsers.length > 0 ? onlyUsers : data);
            })
            .catch((err) => console.error("Error fetching accounts:", err));
    }, []);

    const handleFetchBalance = async () => {
        if (!selectedClientId || !startDate || !endDate) {
            showError(new Error("Please select a client and the full date range."));
            return;
        }

        try {
            const data = await fetchClientBalance(Number(selectedClientId), startDate, endDate);
            console.log("Balance data loaded:", data);
            setBalanceData(data);
        } catch (error) {
            showError(new Error("Failed to fetch client balance."));
        }
    };

    const handleViewInvoice = async (id: number) => {
        try {
            const invoiceDetails = await fetchInvoiceDetails(id);
            await generateAndOpenPdf(invoiceDetails);
        } catch (error) {
            showError(new Error("Failed to open invoice PDF."));
        }
    };

    return (
        <ModulePageContainer>
            <ModuleHeader title="Clients Balance" addLabel="" onAdd={() => {}} />

            {/* --- FILTERS ZONE --- */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Client:</label>
                    <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value ? Number(e.target.value) : "")}
                        style={{ padding: '8px', borderRadius: '4px' }}
                    >
                        <option value="">-- Select Client --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.username} (ID: {client.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}/>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}/>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button onClick={handleFetchBalance} style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Generate Balance
                    </button>
                </div>
            </div>

            {/* --- RESULTS ZONE --- */}
            {balanceData && (
                <>
                    <div style={{ display: 'flex', gap: '40px', marginBottom: '20px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                        <h3>Total: <span style={{color: '#1565c0'}}>${balanceData.totalInvoiced.toFixed(2)}</span></h3>
                        <h3>Total Paid: <span style={{color: '#2e7d32'}}>${balanceData.totalPaid.toFixed(2)}</span></h3>
                        <h3>Rest Pending: <span style={{color: '#d32f2f'}}>${balanceData.totalPending.toFixed(2)}</span></h3>
                    </div>

                    <ModuleTableContainer>
                        <ModuleDataTable
                            rows={balanceData.invoices.map((inv: any) => ({
                                                id: inv.orderId,
                                                orderNumber: inv.description || 'N/A',
                                                total: `$${Number(inv.totalToPay || 0).toFixed(2)}`,
                                                status: inv.status || 'UNKNOWN'
                                                }))}
                                                columns={[
                                                    { label: "ID", key: "id" },
                                                    { label: "Invoice Number", key: "orderNumber" },
                                                    { label: "Total Gross", key: "total" },
                                                    { label: "Status", key: "status" }
                                                ]}
                                                onEdit={handleViewInvoice}
                                                editLabel="View Invoice"
                            />
                    </ModuleTableContainer>
                </>
            )}
        </ModulePageContainer>
    );
}