import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    Dialog,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";

import {
    fetchAccountRequests,
    reviewAccountRequest,
    deleteAccountRequest
} from "../../api/backend";
import type { AccountRequestType } from "../../types/AccountRequest";
import { showError, showSuccess } from "../../utils/toast";

import {
    ModulePageContainer,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell,
    DenyButton,
    DeleteButton, ModalActions, ModalTitle, ModalContent, UserInfoText
} from "../../ui/ModulePage.styles";
import { ModuleHeader } from "../../components/table/ModuleHeader";
import {SaveButton} from "../../ui/ModulePageEdit.styles.ts";

const AVAILABLE_ROLES = ["USER", "EMPLOYEE", "ADMIN"];

export default function AccountRequestsPage() {
    const [requests, setRequests] = useState<AccountRequestType[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<AccountRequestType | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("USER");
    const loadData = () => {
        fetchAccountRequests()
            .then(setRequests)
            .catch(showError);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;
        try {
            await deleteAccountRequest(id);
            showSuccess("Request deleted");
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            showError(e);
        }
    };

    const handleDeny = async (id: number) => {
        if (!window.confirm("Reject this account request?")) return;
        try {
            const updated = await reviewAccountRequest(id, false);
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
            showSuccess("Request rejected");
        } catch (e) {
            showError(e);
        }
    };

    const openApproveModal = (req: AccountRequestType) => {
        setSelectedRequest(req);
        setSelectedRole("USER");
        setOpenModal(true);
    };

    const confirmApprove = async () => {
        if (!selectedRequest) return;
        try {
            const updated = await reviewAccountRequest(selectedRequest.id, true, selectedRole);
            setRequests(prev => prev.map(r => r.id === selectedRequest.id ? updated : r));
            showSuccess(`Request approved as ${selectedRole}`);
            setOpenModal(false);
        } catch (e) {
            showError(e);
        }
    };

    return (
        <ModulePageContainer>
            <ModuleHeader title="Account Requests" />

            <ModuleTableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <ModuleTableHeader>ID</ModuleTableHeader>
                            <ModuleTableHeader>First Name</ModuleTableHeader>
                            <ModuleTableHeader>Last Name</ModuleTableHeader>
                            <ModuleTableHeader>Email</ModuleTableHeader>
                            <ModuleTableHeader>Status</ModuleTableHeader>
                            <ModuleTableHeader align="center">Actions</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.id} hover>
                                <ModuleTableCell>{req.id}</ModuleTableCell>
                                <ModuleTableCell>{req.firstName}</ModuleTableCell>
                                <ModuleTableCell>{req.lastName}</ModuleTableCell>
                                <ModuleTableCell>{req.email}</ModuleTableCell>
                                <ModuleTableCell>
                                    <span style={{
                                        fontWeight: "bold",
                                        color: req.status === "PENDING" ? "#e67e22" :
                                            req.status === "APPROVED" ? "#7e7c1e" :
                                                req.status === "REJECTED" ? "#c0392b" : "#12861c"
                                    }}>
                                        {req.status}
                                    </span>
                                </ModuleTableCell>
                                <ModuleTableCell align="center">
                                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                        {req.status === "PENDING" && (
                                            <>
                                                <SaveButton onClick={() => openApproveModal(req)}>
                                                    Approve
                                                </SaveButton>
                                                <DenyButton onClick={() => handleDeny(req.id)}>
                                                    Deny
                                                </DenyButton>
                                            </>
                                        )}

                                        <DeleteButton onClick={() => handleDelete(req.id)}>
                                            Delete
                                        </DeleteButton>
                                    </div>
                                </ModuleTableCell>
                            </TableRow>
                        ))}
                        {requests.length === 0 && (
                            <TableRow>
                                <ModuleTableCell colSpan={6} align="center">
                                    No requests found.
                                </ModuleTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ModuleTableContainer>

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <ModalTitle>
                    Approve Account Request
                </ModalTitle>

                <ModalContent>
                    <UserInfoText>
                        Assign a role for <strong>{selectedRequest?.firstName} {selectedRequest?.lastName}</strong> <br/>
                        <span>{selectedRequest?.email}</span>
                    </UserInfoText>

                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Assigned Role</InputLabel>
                        <Select
                            value={selectedRole}
                            label="Assigned Role"
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {AVAILABLE_ROLES.map((role) => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ModalContent>

                <ModalActions>
                    <DeleteButton onClick={() => setOpenModal(false)}>
                        Cancel
                    </DeleteButton>
                    <SaveButton onClick={confirmApprove} variant="contained">
                        Confirm & Approve
                    </SaveButton>
                </ModalActions>
            </Dialog>

        </ModulePageContainer>
    );
}