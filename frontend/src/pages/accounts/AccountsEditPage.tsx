import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem } from "@mui/material"; // Import necesar pentru optiunile din dropdown

import { fetchAccountById, updateAccountRole } from "../../api/backend";
import type { AccountType } from "../../types/Account";
import { showError } from "../../utils/toast";

import {
    EditContainer,
    EditCard,
    EditTitle,
    EditInput,
    EditSelect,
    FormActionsWrapper,
    SaveButton,
    BackButton
} from "../../ui/ModulePageEdit.styles";

const AVAILABLE_ROLES = ["USER", "EMPLOYEE", "ADMIN"];

export default function AccountsEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState<AccountType | null>(null);

    useEffect(() => {
        if (id) {
            fetchAccountById(Number(id))
                .then(setAccount)
                .catch(showError);
        }
    }, [id]);

    const handleSave = async () => {
        if (!account) return;
        try {
            await updateAccountRole(account.id, account.assignedRole);
            navigate("/accounts");
        } catch (e) {
            showError(e);
        }
    };

    if (!account) return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>;

    return (
        <EditContainer>
            <EditCard elevation={3}>
                <EditTitle>
                    Edit Account: {account.firstName} {account.lastName}
                </EditTitle>

                <EditInput
                    label="Email"
                    value={account.email}
                    disabled
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <EditInput
                    label="Full Name"
                    value={`${account.firstName} ${account.lastName}`}
                    disabled
                />

                <EditSelect
                    select
                    label="Assigned Role"
                    value={account.assignedRole || "USER"}
                    onChange={(e) => setAccount({ ...account, assignedRole: e.target.value })}
                >
                    {AVAILABLE_ROLES.map((role) => (
                        <MenuItem key={role} value={role}>
                            {role}
                        </MenuItem>
                    ))}
                </EditSelect>

                <FormActionsWrapper>
                    <BackButton onClick={() => navigate("/accounts")}>
                        Cancel
                    </BackButton>

                    <SaveButton onClick={handleSave}>
                        Save Changes
                    </SaveButton>
                </FormActionsWrapper>
            </EditCard>
        </EditContainer>
    );
}