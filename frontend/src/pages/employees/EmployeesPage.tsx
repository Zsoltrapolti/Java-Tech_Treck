import { useEffect, useState } from "react";
import { fetchEmployees, deleteEmployee } from "../../api/backend";
import { useNavigate } from "react-router-dom";
import type { EmployeeType } from "../../types/Employee";

import {
    ModulePageContainer,
    ModuleTableContainer,
} from "../../ui/ModulePage.styles";

import { ModuleHeader } from "../../components/table/ModuleHeader";
import { ModuleDataTable } from "../../components/table/ModuleDataTable";
import { showSuccess } from "../../utils/toast";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees().then((data) => {
            setEmployees(data);
        });
    }, []);

    async function handleDelete(id: number) {
        await deleteEmployee(id);
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        showSuccess("Employee deleted successfully");
    }

    return (
        <ModulePageContainer>
            <ModuleHeader
                title="Employees"
                addLabel="Add Employee"
                onAdd={() => navigate("/employees/new")}
            />

            <ModuleTableContainer>
                <ModuleDataTable
                    rows={employees}
                    columns={[
                        { label: "ID", key: "id" },
                        { label: "First Name", key: "firstName" },
                        { label: "Last Name", key: "lastName" },
                        { label: "Role", key: "role" },
                    ]}
                    onEdit={(id) => navigate(`/employees/${id}/edit`)}
                    onDelete={(id) => handleDelete(id)}
                />
            </ModuleTableContainer>
        </ModulePageContainer>
    );
}
