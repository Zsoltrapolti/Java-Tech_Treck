import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/backend";
import {
    StockPageContainer,
    StockTableContainer,
    StockTableHeader,
    StockBodyRow,
    StockTableCell,
    StockPageTitle,
} from "../styles/StockList.styles";
import { Table, TableHead, TableBody, TableRow } from "@mui/material";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployees()
            .then(setEmployees)
            .catch(() => setError("Could not load employees"));
    }, []);

    return (
        <StockPageContainer>
            <StockPageTitle>Employees</StockPageTitle>
            <StockTableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StockTableHeader>ID</StockTableHeader>
                            <StockTableHeader>First Name</StockTableHeader>
                            <StockTableHeader>Last Name</StockTableHeader>
                            <StockTableHeader>Role</StockTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp) => (
                            <StockBodyRow key={emp.id}>
                                <StockTableCell>{emp.id}</StockTableCell>
                                <StockTableCell>{emp.firstName}</StockTableCell>
                                <StockTableCell>{emp.lastName}</StockTableCell>
                                <StockTableCell>{emp.role}</StockTableCell>
                            </StockBodyRow>
                        ))}
                    </TableBody>
                </Table>
            </StockTableContainer>
            {error && <p style={{ textAlign: "center", color: "#a00" }}>{error}</p>}
        </StockPageContainer>
    );
}
