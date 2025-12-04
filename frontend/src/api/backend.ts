import type { AppInfoType } from "../types/AppInfo.ts";
import type { ModuleType } from "../types/Module.ts";

export async function fetchAppInformation(): Promise<AppInfoType> {
    return{
        name: "Krumpi Management System",
        version: "Mock Version 1.0.0",
    }
}

export async function fetchModules(): Promise<ModuleType[]> {
    return [
        {
            id: 1,
            name: "Raw Material Management",
            description: "Manage raw material stock and warehouse inventory.",
        },
        {
            id: 2,
            name: "Employee Management",
            description: "Manage employee records, roles, and assignments.",
        },
        {
            id: 3,
            name: "Order Management",
            description: "Manage customer orders, processing, and delivery status.",
        },
    ];
}

const BACKEND_URL = "http://localhost:8081/api";

export async function fetchStockEntries() {
    const response = await fetch(`${BACKEND_URL}/stock`);
    if (!response.ok) {
        throw new Error("Failed to fetch stock entries");
    }
    return response.json();
}

export async function fetchStockEntryById(id: number) {
    const response = await fetch(`${BACKEND_URL}/stock/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch stock entry with id ${id}`);
    }
    return response.json();
}

export async function updateStockEntryQuantity(id: number, quantity: number) {
    const response = await fetch(`${BACKEND_URL}/stock/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
        throw new Error(`Failed to update stock entry with id ${id}`);
    }
    return response.json();
}