import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchAccounts } from "../../api/backend";
import type { AccountType } from "../../types/Account";

import {
    ModulePageContainer,
    ModuleTableContainer,
} from "../../ui/ModulePage.styles";

import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import { showError } from "../../utils/toast";

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAccounts()
            .then(setAccounts)
            .catch(showError);
    }, []);

    return (
        <ModulePageContainer>
            <ModuleHeader
                title="Accounts"
            />

            <ModuleTableContainer>
                <ModuleDataTable
                    rows={accounts}
                    columns={[
                        { label: "ID", key: "id" },
                        { label: "First Name", key: "firstName" },
                        { label: "Last Name", key: "lastName" },
                        { label: "Email", key: "email" },
                        { label: "Status", key: "status" },
                        { label: "Assigned Role", key: "assignedRole" },
                    ]}
                    onEdit={(id) => navigate(`/accounts/${id}/edit`)}
                    onDelete={() => {}}
                />
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}
