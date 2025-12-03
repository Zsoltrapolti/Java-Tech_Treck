import {useEffect, useState} from 'react';
import {fetchModules} from "../api/backend.ts";
import type {ModuleType} from "../types/Module.ts";
import {
    Table,
    TableRow,
    TableHead,
    TableBody
} from "@mui/material";
import {ModuleTableContainer, ModuleTableCell, ModuleBodyRow, ModuleTableCell2} from "../styles/ModuleList.styles.ts";

export default function ModuleList() {
    const [modules, setModules] = useState<ModuleType[]>([]);

    useEffect(() => {
        fetchModules().then(setModules);
    }, [])

    return(
        <ModuleTableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <ModuleTableCell>ID</ModuleTableCell>
                        <ModuleTableCell>Name</ModuleTableCell>
                        <ModuleTableCell>Description</ModuleTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {modules.map((module) => (
                        <ModuleBodyRow key={module.id}>
                            <ModuleTableCell2>{module.id}</ModuleTableCell2>
                            <ModuleTableCell2>{module.name}</ModuleTableCell2>
                            <ModuleTableCell2>{module.description}</ModuleTableCell2>
                        </ModuleBodyRow>
                    ))}
                </TableBody>
            </Table>
        </ModuleTableContainer>
    );
}