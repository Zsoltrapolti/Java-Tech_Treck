import { useEffect, useState } from 'react';
import { fetchModules } from "../api/backend.ts";
import type { ModuleType } from "../types/Module.ts";

import {
    Table,
    TableRow,
    TableHead,
    TableBody
} from "@mui/material";

import {
    ModuleTableCell, ModuleTableHeader
} from "../styles/ModulePage.styles.ts";
import {ModulesTableContainer} from "../styles/HomePage.styles.ts";

export default function HomeList() {
    const [modules, setModules] = useState<ModuleType[]>([]);

    useEffect(() => {
        fetchModules().then(setModules);
    }, []);

    return (
        <ModulesTableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <ModuleTableHeader>ID</ModuleTableHeader>
                        <ModuleTableHeader>Name</ModuleTableHeader>
                        <ModuleTableHeader>Description</ModuleTableHeader>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {modules.map((module) => (
                        <TableRow key={module.id}>
                            <ModuleTableCell>{module.id}</ModuleTableCell>
                            <ModuleTableCell>{module.name}</ModuleTableCell>
                            <ModuleTableCell>{module.description}</ModuleTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ModulesTableContainer>
    );
}
