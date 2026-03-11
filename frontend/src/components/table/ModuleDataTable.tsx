import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import {
    ModuleTableCell,
    ModuleTableHeader,
    EditButton,
    DeleteButton
} from "../../ui/ModulePage.styles.ts";

export function ModuleDataTable({
                              rows,
                              columns,
                              onEdit,
                              onDelete,
                              editLabel
}: {
    rows: any[],
    columns: { label: string, key: string }[],
    onEdit?: (id: number) => void,
    onDelete?: (id: number) => void,
    editLabel?: string
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

                    {onEdit && (<ModuleTableHeader>{editLabel || "Edit"}</ModuleTableHeader>)}
                    {onDelete && <ModuleTableHeader>Delete</ModuleTableHeader>}
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

                        {onEdit && (
                        <ModuleTableCell>
                            <EditButton onClick={() => onEdit(row.id)}>
                               Edit
                            </EditButton>
                        </ModuleTableCell>)}

                        {onDelete && (
                            <ModuleTableCell>
                                <DeleteButton onClick={() => onDelete(row.id)}>
                                    Delete
                                </DeleteButton>
                            </ModuleTableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
