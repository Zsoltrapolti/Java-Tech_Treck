import { useEffect, useState } from "react";
import { fetchAllLeaveRequests, approveLeaveRequest, cancelLeaveRequest } from "../../api/backend";
import { ModulePageContainer, ModuleTableContainer } from "../../ui/ModulePage.styles";
import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import { showSuccess, showError } from "../../utils/toast";
import type { LeaveRequestType } from "../../types/Leave";

export default function ManageLeavesPage() {
    const [requests, setRequests] = useState<LeaveRequestType[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchAllLeaveRequests();
            setRequests(data);
        } catch (error) {
            console.error(error);
            showError(new Error("Failed to load leave requests."));
        }
    };

    const handleApprove = async (id: number) => {
        if (window.confirm("Are you sure you want to approve this leave request?")) {
            try {
                await approveLeaveRequest(id);
                showSuccess("Leave request approved successfully!");
                loadData();
            } catch (error: any) {
                showError(error);
            }
        }
    };

    const handleReject = async (id: number) => {
        if (window.confirm("Are you sure you want to reject/cancel this request?")) {
            try {
                await cancelLeaveRequest(id);
                showSuccess("Leave request rejected.");
                loadData();
            } catch (error: any) {
                showError(error);
            }
        }
    };

    return (
        <ModulePageContainer>
            <ModuleHeader
                title="Manage Leaves (Admin)"
                addLabel=""
                onAdd={() => {}}
            />

            <ModuleTableContainer>
                <ModuleDataTable
                    rows={requests.map(req => ({
                        id: req.id,
                        employeeName: req.employee ? `${req.employee.firstName} ${req.employee.lastName}` : `Employee ID ${req.employee}`,
                        period: `${req.startDate} -> ${req.endDate}`,
                        days: req.requestedDays,
                        status: req.status
                    }))}
                    columns={[
                        { label: "ID", key: "id" },
                        { label: "Employee", key: "employeeName" },
                        { label: "Period", key: "period" },
                        { label: "Days", key: "days" },
                        { label: "Status", key: "status" }
                    ]}
                    onEdit={handleApprove}
                    onDelete={handleReject}
                />
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}