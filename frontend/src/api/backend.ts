import type { AppInfoType } from "../types/AppInfo.ts";
import type { ModuleType } from "../types/Module.ts";
import type { StockEntryType } from "../types/StockEntry.ts";
import type { ProductType } from "../types/Product.ts";

const BACKEND_URL = "http://localhost:8081/api";
let authHeader: Record<string, string> = {};

// restore auth header(avoids 401 after refresh) - de eliminat mai tarziu
if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("authToken");
    if (saved) {
        authHeader = { Authorization: `Basic ${saved}` };
    }
}

export function setAuthHeader(username: string, password: string) {
    const token = btoa(`${username}:${password}`);
    authHeader = { Authorization: `Basic ${token}` };
    if (typeof window !== "undefined") {
        window.localStorage.setItem("authToken", token);
    }
}

async function authFetch(url: string, options: RequestInit = {}) {
    const resp = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...authHeader,
        },
    });
    if (resp.status === 401) {
        // clear auth + relogin ... de eliminat mai tarziu 
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("authToken");
            if (!window.location.pathname.startsWith("/")) {
                window.location.href = "/";
            } else if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }
        throw new Error("Unauthorized");
    }
    return resp;
}

export async function fetchAppInformation(): Promise<AppInfoType> {
    return {
        name: "Krumpi Management System",
        version: "Krumpi Version 1.0.0",
    };
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

export async function fetchStockEntries(): Promise<StockEntryType[]> {
    const resp = await authFetch(`${BACKEND_URL}/products`); // GET /api/products
    if (!resp.ok) {
        throw new Error("Failed to fetch products");
    }
    const products: ProductType[] = await resp.json();
    return products.map((p) => ({
        id: p.id,
        product: {
            id: p.id,
            name: p.name,
            type: p.type,
            unitOfMeasure: p.unitOfMeasure,
            quantity: p.quantity,
        },
        quantity: p.quantity,
    }));
}

export async function fetchStockEntryById(id: number) {
    const resp = await authFetch(`${BACKEND_URL}/products/${id}`); // GET /api/products/{id}
    if (!resp.ok) {
        throw new Error(`Failed to fetch product with id ${id}`);
    }
    const p: ProductType = await resp.json();
    return {
        id: p.id,
        product: {
            id: p.id,
            name: p.name,
            type: p.type,
            unitOfMeasure: p.unitOfMeasure,
            quantity: p.quantity,
        },
        quantity: p.quantity,
    } as StockEntryType;
}

export async function updateStockEntryQuantity(id: number, quantity: number) {
    const resp = await authFetch(`${BACKEND_URL}/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
    });
    if (!resp.ok) {
        throw new Error(`Failed to update product with id ${id}`);
    }
    const p: ProductType = await resp.json();
    return {
        id: p.id,
        product: {
            id: p.id,
            name: p.name,
            type: p.type,
            unitOfMeasure: p.unitOfMeasure,
            quantity: p.quantity,
        },
        quantity: p.quantity,
    } as StockEntryType;
}

export async function fetchProducts() {
    const resp = await authFetch(`${BACKEND_URL}/products`);
    if (!resp.ok) throw new Error("Failed to fetch products");
    return resp.json();
}

export async function fetchEmployees() {
    const resp = await authFetch(`${BACKEND_URL}/employees`);
    if (!resp.ok) throw new Error("Failed to fetch employees");
    return resp.json();
}

export async function fetchOrders() {
    const resp = await authFetch(`${BACKEND_URL}/orders`);
    if (!resp.ok) throw new Error("Failed to fetch orders");
    return resp.json();
}
