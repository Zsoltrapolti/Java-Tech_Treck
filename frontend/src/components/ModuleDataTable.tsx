import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import {
    ModuleTableCell,
    ModuleTableHeader,
    EditButton,
    DeleteButton
} from "../styles/ModulePage.styles.ts";

export function ModuleDataTable({
                              rows,
                              columns,
                              onEdit,
                              onDelete
                          }: {
    rows: any[],
    columns: { label: string, key: string }[],
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
}) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map(col => (
                        <ModuleTableHeader key={col.key}>
                            {col.label}
                        </ModuleTableHeader>
                    ))}
                    <ModuleTableHeader>Edit</ModuleTableHeader>
                    <ModuleTableHeader>Delete</ModuleTableHeader>
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map(row => (
                    <TableRow key={row.id}>
                        {columns.map(col => (
                            <ModuleTableCell key={col.key}>
                                {row[col.key]}
                            </ModuleTableCell>
                        ))}

                        <ModuleTableCell>
                            <EditButton onClick={() => onEdit(row.id)}>
                                Edit
                            </EditButton>
                        </ModuleTableCell>

                        <ModuleTableCell>
                            <DeleteButton onClick={() => onDelete(row.id)}>
                                Delete
                            </DeleteButton>
                        </ModuleTableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
