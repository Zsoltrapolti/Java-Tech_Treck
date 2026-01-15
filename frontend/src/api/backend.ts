import type { ModuleType } from "../types/Module";
import type { StockEntryType } from "../types/StockEntry";
import type { ProductType } from "../types/Product";
import type {EmployeeType} from "../types/Employee.ts";
import {showError} from "../utils/toast.ts";
import type {OrderType} from "../types/Order.ts";

const BACKEND_URL = "http://localhost:8081/api";
let authHeader: Record<string, string> = {};

if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("authToken");
    if (saved) {
        authHeader = { Authorization: `Basic ${saved}` };
    }
}

async function handleError(resp: Response) {
    let message = "Unexpected error";

    try {
        const data = await resp.json();
        message = data.message || JSON.stringify(data);
    } catch {
        message = resp.statusText;
    }

    showError(new Error(message));
    throw new Error(message);
}

export function setAuthHeader(username: string, password: string) {
    const token = btoa(`${username}:${password}`);
    authHeader = { Authorization: `Basic ${token}` };
    window.localStorage.setItem("authToken", token);
}

export async function claimProduct(productId: number): Promise<void> {
    const resp = await authFetch(`${BACKEND_URL}/products/${productId}/claim`, {
        method: "PUT",
    });

    if (!resp.ok) {
        await handleError(resp);
    }
}

export async function fetchMe() {
    const resp = await authFetch("http://localhost:8081/api/auth/me");
    if (!resp.ok) throw new Error("Not authenticated");
    return resp.json();
}


export async function registerUser(
    username: string,
    password: string,
    role: "USER" | "EMPLOYEE" | "ADMIN" = "USER"
) {
    const resp = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
    });

    if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || "Register failed");
    }

    return true;
}


export async function login(username: string, password: string) {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();

    const token = btoa(`${username}:${password}`);
    authHeader = { Authorization: `Basic ${token}` };

    localStorage.setItem("username", username);
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", data.role);

    if (data.id) {
        localStorage.setItem("userId", data.id.toString());
    }

    return data.role;
}

export function logout() {
    window.localStorage.removeItem("authToken");
    localStorage.removeItem("role");
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


export async function fetchMyProducts(): Promise<ProductType[]> {
    const resp = await authFetch(`${BACKEND_URL}/products/my`);
    if (!resp.ok) throw new Error("Failed to fetch your products");
    return resp.json();
}

export async function fetchProducts(): Promise<ProductType[]> {
    const resp = await authFetch(`${BACKEND_URL}/products`);
    if (!resp.ok) throw new Error("Failed to fetch products");
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

export async function fetchEmployees(): Promise<EmployeeType[]> {
    const resp = await authFetch(`${BACKEND_URL}/employees`);
    if (!resp.ok) throw new Error("Failed to fetch employees");
    return resp.json();
}


export async function fetchOrders(): Promise<OrderType[]> {
    const resp = await authFetch(`${BACKEND_URL}/orders`);
    if (!resp.ok) throw new Error("Failed to fetch orders");
    return resp.json();
}


export async function fetchOrderById(id: number): Promise<OrderType> {
    const resp = await authFetch(`${BACKEND_URL}/orders/${id}`);
    if (!resp.ok) throw new Error("Failed to fetch order");
    return resp.json();
}



export async function fetchProductById(id: number): Promise<ProductType> {
    const resp = await authFetch(`${BACKEND_URL}/products/${id}`);
    if (!resp.ok) throw new Error(`Failed to fetch product ${id}`);
    return resp.json();
}

export async function fetchEmployeeById(id: number): Promise<EmployeeType> {
    const resp = await authFetch(`${BACKEND_URL}/employees/${id}`);
    if (!resp.ok) throw new Error(`Failed to fetch employee ${id}`);
    return resp.json();
}


export async function updateOrder(order: OrderType) {
    if (!order.id) {
        throw new Error("Order ID is required for update");
    }

    const resp = await authFetch(`${BACKEND_URL}/orders/${order.id}`, {
        method: "PUT",
        body: JSON.stringify(order),
    });

    if (!resp.ok) await handleError(resp);
    return resp.json();
}


export async function updateProduct(product: ProductType) {
    const resp = await authFetch(`${BACKEND_URL}/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    });

    if (!resp.ok)
        await handleError(resp);
    return resp.json();
}

export async function updateEmployee(employee: EmployeeType) {
    const resp = await authFetch(`${BACKEND_URL}/employees/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(employee),
    });

    if (!resp.ok)
        await handleError(resp);
    return resp.json();
}




export async function deleteProduct(id: number) {
    const resp = await authFetch(`${BACKEND_URL}/products/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) throw new Error("Failed to delete product");
}

export async function deleteOrder(id: number) {
    const resp = await authFetch(`${BACKEND_URL}/orders/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) throw new Error("Failed to delete order");
}

export async function deleteEmployee(id: number) {
    const resp = await authFetch(`${BACKEND_URL}/employees/${id}`, {
        method: "DELETE",
    });

    if (!resp.ok) throw new Error("Failed to delete employee");
}



export async function createProduct(product: ProductType) {
    const resp = await authFetch(`${BACKEND_URL}/products`, {
        method: "POST",
        body: JSON.stringify(product)
    });

    if (!resp.ok)
        await handleError(resp);
    return resp.json();
}

export async function createOrder(order: OrderType) {
    const resp = await authFetch(`${BACKEND_URL}/orders`, {
        method: "POST",
        body: JSON.stringify(order),
    });

    if (!resp.ok) await handleError(resp);
    return resp.json();
}



export async function createEmployee(employee: EmployeeType) {
    const resp = await authFetch(`${BACKEND_URL}/employees`, {
        method: "POST",
        body: JSON.stringify(employee),
    });

    if (!resp.ok)
        await handleError(resp);
    return resp.json();
}

export async function addProductToMyList(productId: number): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/products/my-selection`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ productId })
    });

    if (!response.ok) {
        throw new Error("Could not add product to your selection");
    }
}

export async function unclaimProduct(productId: number): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/products/${productId}/unclaim`, {
        method: "PUT",
        headers: {
            "Authorization": `Basic ${localStorage.getItem("authToken")}`
        }
    });

    if (!response.ok) {
        throw new Error("Could not eliminate product.");
    }
}

// Account Request Functions
export async function requestAccount(
    firstName: string,
    lastName: string,
    email: string
): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/account-requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit account request");
    }
}

export async function checkRequestStatus(email: string): Promise<string> {
    const response = await fetch(
        `${BACKEND_URL}/account-requests/status?email=${encodeURIComponent(email)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to check request status");
    }

    const data = await response.json();
    return data.status; // Expected values: "PENDING", "APPROVED", "REJECTED", "NOT_FOUND"
}