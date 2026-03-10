import { useEffect, useState } from "react";
import { fetchEmployeeLeaves, submitLeaveRequest, cancelLeaveRequest, fetchEmployeeById } from "../../api/backend";
import { ModulePageContainer, ModuleTableContainer } from "../../ui/ModulePage.styles";
import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import { showSuccess, showError } from "../../utils/toast";
import type { LeaveRequestType } from "../../types/Leave";
import type { EmployeeType } from "../../types/Employee";

export default function MyLeavesPage() {
    const [leaves, setLeaves] = useState<LeaveRequestType[]>([]);
    const [employee, setEmployee] = useState<EmployeeType | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const employeeId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        if (employeeId) {
            loadData();
        } else {
            showError(new Error("Error: You are not logged in as an employee."));
        }
    }, [employeeId]);

    const loadData = async () => {
        try {
            const emp = await fetchEmployeeById(employeeId);
            setEmployee(emp);
            const reqs = await fetchEmployeeLeaves(employeeId);
            setLeaves(reqs);
        } catch (error) {
            console.error(error);
            showError(new Error("Failed to load leave data."));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            showError(new Error("Please select both dates."));
            return;
        }

        try {
            await submitLeaveRequest({ employeeId, startDate, endDate });
            showSuccess("Leave request submitted successfully!");
            setStartDate("");
            setEndDate("");
            loadData();
        } catch (error: any) {
            showError(error);
        }
    };

    const handleCancel = async (requestId: number) => {
        if (window.confirm("Are you sure you want to cancel this request?")) {
            try {
                await cancelLeaveRequest(requestId);
                showSuccess("Request has been cancelled.");
                loadData();
            } catch (error: any) {
                showError(error);
            }
        }
    };

    if (!employee) return <p style={{ padding: '20px' }}>Loading data...</p>;

    const remainingDays = (employee.totalLeaveDays || 21) - (employee.usedLeaveDays || 0);

    return (
        <ModulePageContainer>
            <ModuleHeader
                title="My Leaves"
                addLabel=""
                onAdd={() => {}}
            />

            {/* Leave Balance and Form Section */}
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "30px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    <div style={{ padding: "15px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", flex: 1 }}>
                        <h3 style={{ margin: "0 0 10px 0", color: "#166534" }}>Leave Balance</h3>
                        <p style={{ margin: 0 }}>Total days: <strong>{employee.totalLeaveDays}</strong></p>
                        <p style={{ margin: 0 }}>Used days: <strong>{employee.usedLeaveDays}</strong></p>
                        <p style={{ margin: "10px 0 0 0", fontSize: "18px" }}>Remaining days: <strong style={{ color: "#15803d" }}>{remainingDays}</strong></p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ flex: 2, display: "flex", flexDirection: "column", gap: "10px" }}>
                        <h3 style={{ margin: "0 0 10px 0" }}>Submit a new request</h3>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ flex: 1 }}>
                                <label>Start Date:</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>End Date:</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
                            </div>
                        </div>
                        <button type="submit" style={{ padding: "10px", background: "#15803d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}>
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>

            {/* Leave History Table */}
            <h3 style={{ marginBottom: "15px" }}>Request History</h3>
            <ModuleTableContainer>
                <ModuleDataTable
                    rows={leaves.map(l => ({
                        id: l.id,
                        period: `${l.startDate} -> ${l.endDate}`,
                        days: l.requestedDays,
                        status: l.status
                    }))}
                    columns={[
                        { label: "ID", key: "id" },
                        { label: "Period", key: "period" },
                        { label: "Requested Days", key: "days" },
                        { label: "Status", key: "status" }
                    ]}
                    onEdit={(id) => console.log("Cannot edit leave requests directly", id)}
                    onDelete={handleCancel}
                />
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}