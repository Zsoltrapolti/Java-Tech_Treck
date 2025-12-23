import type { ModuleType } from "../types/Module";
import type { StockEntryType } from "../types/StockEntry";
import type { ProductType } from "../types/Product";
import type {OrderType} from "../types/Order.ts";
import type {EmployeeType} from "../types/Employee.ts";

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
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data: { username: string; role: "USER" | "EMPLOYEE" | "ADMIN" } =
        await response.json();

    const token = btoa(`${username}:${password}`);

    authHeader = { Authorization: `Basic ${token}` };
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", data.role);

    return data.role;
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
    const resp = await authFetch(`${BACKEND_URL}/orders/${order.id}`, {
        method: "PUT",
        body: JSON.stringify(order)
    });
    if (!resp.ok) throw new Error("Failed to update order");
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

export async function updateEmployee(employee: EmployeeType) {
    const resp = await authFetch(`${BACKEND_URL}/employees/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(employee),
    });

    if (!resp.ok) throw new Error(`Failed to update employee ${employee.id}`);
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

    if (!resp.ok) throw new Error("Failed to create product");
    return resp.json();
}

export async function createOrder(order: OrderType) {
    const resp = await authFetch(`${BACKEND_URL}/orders`, {
        method: "POST",
        body: JSON.stringify(order),
    });

    if (!resp.ok) throw new Error("Failed to create order");
    return resp.json();
}

export async function createEmployee(employee: EmployeeType) {
    const resp = await authFetch(`${BACKEND_URL}/employees`, {
        method: "POST",
        body: JSON.stringify(employee),
    });

    if (!resp.ok) throw new Error("Failed to create employee");
    return resp.json();
}

