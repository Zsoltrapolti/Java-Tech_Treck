import { useEffect, useState } from "react";
import { deleteEmployee, fetchEmployees } from "../../api/backend.ts";
import { useNavigate } from "react-router-dom";

import {
    ModulePageContainer,
    ModuleTableContainer
} from "../../ui/ModulePage.styles.ts";

import { ModuleHeader } from "../../components/table/ModuleHeader.tsx";
import { ModuleDataTable } from "../../components/table/ModuleDataTable.tsx";
import type { EmployeeType } from "../../types/Employee.ts";
import {showSuccess} from "../../utils/toast.ts";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees().then(setEmployees);
    }, []);

    function handleDelete(id: number) {
        deleteEmployee(id);
        setEmployees(prev => prev.filter(e => e.id !== id));
        showSuccess("Employee removed successfully.");
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
                    rows={employees.map(e => ({
                        id: e.id,
                        firstName: e.firstName,
                        lastName: e.lastName,
                        role: e.role
                    }))}

                    columns={[
                        { label: "ID", key: "id" },
                        { label: "First Name", key: "firstName" },
                        { label: "Last Name", key: "lastName" },
                        { label: "Role", key: "role" },
                    ]}

                    onEdit={id => navigate(`/employees/${id}/edit`)}
                    onDelete={handleDelete}
                />
            </ModuleTableContainer>

        </ModulePageContainer>
    );
}
