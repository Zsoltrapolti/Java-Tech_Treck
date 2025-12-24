import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {fetchEmployeeById, updateEmployee} from "../../api/backend.ts";

import { EditFormPage } from "../../components/form/EditFormPage.tsx";
import { EditFormField } from "../../components/form/EditFormField.tsx";
import { EditFormActions } from "../../components/form/EditFormActions.tsx";

import type { EmployeeType } from "../../types/Employee.ts";
import {showError} from "../../utils/toast.ts";

export default function EmployeesEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<EmployeeType | null>(null);

    useEffect(() => {
        if (id) fetchEmployeeById(Number(id)).then(setEmployee);
    }, [id]);

    if (!employee) return <p>Loading...</p>;

    return (
        <EditFormPage title="Edit Employee">

            <EditFormField
                label="First Name"
                value={employee.firstName}
                onChange={v => setEmployee({ ...employee, firstName: v })}
            />

            <EditFormField
                label="Last Name"
                value={employee.lastName}
                onChange={v => setEmployee({ ...employee, lastName: v })}
            />

            <EditFormField
                label="Role"
                value={employee.role}
                onChange={v => setEmployee({ ...employee, role: v })}
            />

            <EditFormActions
                onSave={async () => {
                    try {
                        await updateEmployee(employee);
                        navigate("/employees");
                    } catch (e) {
                        showError(e);
                    }
                }}
                onCancel={() => navigate("/employees")}
            />

        </EditFormPage>
    );
}
