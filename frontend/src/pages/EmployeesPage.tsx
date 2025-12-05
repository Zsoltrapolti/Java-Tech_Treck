import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/backend";
import { useNavigate } from "react-router-dom";

import {
    BackButton,
    StockPageContainer,
    StockPageTitle,
    StockPaper,
    StockTableContainer,
    StockTableHeader,
    StockBodyRow,
    StockTableCell,
} from "../styles/StockList.styles";

import { Table, TableHead, TableBody, TableRow } from "@mui/material";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees()
            .then(setEmployees)
    }, []);

    return (
        <StockPageContainer>
            <BackButton variant="contained" onClick={() => navigate("/home")}>
                Back to Home
            </BackButton>

            <StockPaper>
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
            </StockPaper>
        </StockPageContainer>
    );
}
