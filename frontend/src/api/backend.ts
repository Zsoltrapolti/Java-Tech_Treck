import type { AppInfoType } from "../types/AppInfo";
import type { ModuleType } from "../types/Module";
import type { StockEntryType } from "../types/StockEntry";
import type { ProductType } from "../types/Product";
import type {OrderType} from "../types/Order.ts";

const BACKEND_URL = "http://localhost:8081/api";


let authHeader: Record<string, string> = {};

if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("authToken");
    if (saved) {
        authHeader = { Authorization: `Basic ${saved}` };
    }
}

export function setAuthHeader(username: string, password: string) {
    const token = btoa(`${username}:${password}`);
    authHeader = { Authorization: `Basic ${token}` };
    window.localStorage.setItem("authToken", token);
}

export async function login(username: string, password: string) {
    const VALID_USER = "admin";
    const VALID_PASS = "password";
    if (username !== VALID_USER || password !== VALID_PASS) {
        throw new Error("Invalid credentials");
    }

    const token = btoa(`${username}:${password}`);

    window.localStorage.setItem("authToken", token);
    authHeader = { Authorization: `Basic ${token}` };

    return true;

    // const token = btoa(`${username}:${password}`);
    //
    // const resp = await fetch(`${BACKEND_URL}/auth/login`, {
    //     method: "GET",
    //     headers: {
    //         "Authorization": `Basic ${token}`
    //     }
    // });
    //
    // if (!resp.ok) {
    //     throw new Error("Invalid credentials");
    // }
    //
    // window.localStorage.setItem("authToken", token);
    // authHeader = { Authorization: `Basic ${token}` };
}

export function logout() {
    window.localStorage.removeItem("authToken");
    window.location.href = "/";
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
        window.localStorage.removeItem("authToken");
        window.location.href = "/";
        throw new Error("Unauthorized");
    }

    return resp;
}


export async function fetchAppInformation(): Promise<AppInfoType> {
    return {
        name: "Krumpi Management System",
        version: "1.0.0",
    };
}

export async function fetchModules(): Promise<ModuleType[]> {
    return [
        {
            id: 1,
            name: "Raw Material Management",
            description: "Manage raw material stock and warehouse inventory."
        },
        {
            id: 2,
            name: "Employee Management",
            description: "Manage employee records, roles, and assignments."
        },
        {
            id: 3,
            name: "Order Management",
            description: "Manage customer orders, processing, and delivery status."
        }
    ];
}


export async function fetchProducts(): Promise<ProductType[]> {
    const resp = await authFetch(`${BACKEND_URL}/products`);
    if (!resp.ok) throw new Error("Failed to fetch products");
    return resp.json();
}

export async function fetchProductById(id: number): Promise<ProductType> {
    const resp = await authFetch(`${BACKEND_URL}/products/${id}`);
    if (!resp.ok) throw new Error(`Failed to fetch product ${id}`);
    return resp.json();
}

export async function updateProduct(product: ProductType) {
    const resp = await authFetch(`${BACKEND_URL}/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    });

    if (!resp.ok) throw new Error(`Failed to update product ${product.id}`);
    return resp.json();
}

export async function fetchStockEntries(): Promise<StockEntryType[]> {
    const products = await fetchProducts();

    return products.map((p) => ({
        id: p.id,
        product: p,
        quantity: p.quantity,
    }));
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

export async function fetchOrderById(id: number) {
    const resp = await authFetch(`${BACKEND_URL}/orders/${id}`);
    if (!resp.ok) throw new Error("Failed to fetch order");
    return resp.json();
}

export async function updateOrder(order: OrderType) {
    const resp = await authFetch(`${BACKEND_URL}/orders/${order.id}`, {
        method: "PUT",
        body: JSON.stringify(order)
    });
    if (!resp.ok) throw new Error("Failed to update order");
    return resp.json();
}

