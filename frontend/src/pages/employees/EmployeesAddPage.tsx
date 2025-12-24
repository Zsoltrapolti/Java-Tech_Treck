import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {createEmployee} from "../../api/backend.ts";

import { EditFormPage } from "../../components/form/EditFormPage.tsx";
import { EditFormField } from "../../components/form/EditFormField.tsx";
import { EditFormActions } from "../../components/form/EditFormActions.tsx";
import {showError} from "../../utils/toast.ts";

export default function EmployeesAddPage() {
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        id: 0,
        firstName: "",
        lastName: "",
        role: ""
    });

    return (
        <EditFormPage title="Add Employee">

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
                        await createEmployee(employee);
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
