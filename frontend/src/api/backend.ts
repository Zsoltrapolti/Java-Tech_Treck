import type { ModuleType } from "../types/Module";
import type { StockEntryType } from "../types/StockEntry";
import type { ProductType } from "../types/Product";
import type { EmployeeType } from "../types/Employee";
import type { OrderType } from "../types/Order";
import type { AccountType } from "../types/Account";
import type { AccountRequestType } from "../types/AccountRequest";
import type { OrderSummaryDTO, InvoiceDTO } from "../types/Invoice";
import type { ShoppingCartDTO } from "../types/ShoppingCart";
import { showError } from "../utils/toast";
import { jwtDecode } from "jwt-decode";
import { pdf } from '@react-pdf/renderer';
import type { InvoiceDTO, OrderSummaryDTO } from '../types/Invoice';
import type {ShoppingCartDTO} from "../types/ShoppingCart.ts";
import React from 'react';
import { InvoiceDocument } from '../components/pdf/InvoiceDocument';
import type {CheckoutRequestDTO} from "../types/CheckoutRequestDTO.ts";


const BACKEND_URL = "http://localhost:8081/api";
let authHeader: Record<string, string> = {};

if (typeof window !== "undefined") {
    const savedToken = window.localStorage.getItem("authToken");
    if (savedToken) {
        authHeader = { Authorization: `Bearer ${savedToken}` };
    }
}

interface DecodedToken {
    exp: number;
    [key: string]: unknown;
}

function isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch {
        return true;
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

async function authFetch(url: string, options: RequestInit = {}) {
    const token = window.localStorage.getItem("authToken");

    if (!token || isTokenExpired(token)) {
        console.warn("Token expired or missing. Logging out...");
        logout();
        throw new Error("Session expired. Please login again.");
    }

    const resp = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...authHeader,
        },
    });

    if (resp.status === 401) {
        logout();
        throw new Error("Unauthorized");
    }

    return resp;
}

function getRoleFromToken(token: string): string {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        const role = payload.role || payload.roles?.[0] || payload.authorities?.[0] || "USER";
        return role.replace("ROLE_", "");
    } catch {
        return "USER";
    }
}

export async function login(username: string, password: string) {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    const token = data.token;
    const role = getRoleFromToken(token);

    authHeader = { Authorization: `Bearer ${token}` };
    localStorage.setItem("username", username);
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", role);

    if (data.id) {
        localStorage.setItem("userId", data.id.toString());
    }

    return role;
}

export function logout() {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("userId");
    authHeader = {};
    window.location.href = "/";
}

export async function registerUser(username: string, password: string, role: "USER" | "EMPLOYEE" | "ADMIN" = "USER") {
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

export async function requestAccount(firstName: string, lastName: string, email: string): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/account-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit account request");
    }
}

export async function checkRequestStatus(email: string): Promise<string> {
    const response = await fetch(`${BACKEND_URL}/account-requests/status?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to check request status");
    }
    const data = await response.json();
    return data.status;
}

export async function fetchMe() {
    const resp = await authFetch(`${BACKEND_URL}/auth/me`);
    if (!resp.ok) throw new Error("Not authenticated");
    return resp.json();
}

export async function fetchModules(): Promise<ModuleType[]> {
    return [
        { id: 1, name: "Raw Material Management", description: "Manage raw material stock and warehouse inventory." },
        { id: 2, name: "Employee Management", description: "Manage employee records, roles, and assignments." },
        { id: 3, name: "Order Management", description: "Manage customer orders, processing, and delivery status." }
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

export async function fetchAccounts(): Promise<AccountType[]> {
    const resp = await authFetch(`${BACKEND_URL}/admin/accounts`);
    if (!resp.ok) {throw new Error("Failed to fetch accounts");}
    return resp.json();
}

export async function fetchAccountRequests(): Promise<AccountRequestType[]> {
    const resp = await authFetch(`${BACKEND_URL}/admin/account-requests`);
    if (!resp.ok) throw new Error("Failed to fetch account requests");
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

export async function fetchAccountById(id: number): Promise<AccountType> {
    const resp = await authFetch(`${BACKEND_URL}/admin/accounts/${id}`);
    if (!resp.ok) throw new Error("Failed to fetch account");
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
    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function updateEmployee(employee: EmployeeType) {
    const resp = await authFetch(`${BACKEND_URL}/employees/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(employee),
    });
    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function updateAccountRole(id: number, assignedRole: string): Promise<AccountType> {
    const resp = await authFetch(
        `${BACKEND_URL}/admin/accounts/${id}/role`,
        {
            method: "PUT",
            body: JSON.stringify(assignedRole),
            headers: { "Content-Type": "application/json" }
        }
    );
    if (!resp.ok) await handleError(resp);
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

export async function deleteAccountRequest(id: number): Promise<void> {
    const resp = await authFetch(`${BACKEND_URL}/admin/account-requests/${id}`, {
        method: "DELETE"
    });
    if (!resp.ok) throw new Error("Failed to delete request");
}

export async function createProduct(product: ProductType) {
    const resp = await authFetch(`${BACKEND_URL}/products`, {
        method: "POST",
        body: JSON.stringify(product)
    });
    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function createOrder(order: OrderType) {
    const payload = {
        ...order,
        creationDate: order.creationDate ? new Date(order.creationDate).toISOString() : new Date().toISOString(),
        status: order.status || "PENDING"
    };
    const resp = await authFetch(`${BACKEND_URL}/orders`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function createEmployee(employee: EmployeeType) {
    const resp = await authFetch(`${BACKEND_URL}/employees`, {
        method: "POST",
        body: JSON.stringify(employee),
    });
    if (!resp.ok) await handleError(resp);
    return resp.json();
}


export async function addProductToMyList(productId: number): Promise<void> {
    const resp = await authFetch(`${BACKEND_URL}/products/my-selection`, {
        method: "POST",
        // Sending as object: { "productId": 5 }
        body: JSON.stringify({ productId: productId }),
        headers: { "Content-Type": "application/json" }
    });

    if (!resp.ok) {
        throw new Error("Could not add product. Check SecurityConfig!");
    }
}

export async function performCheckout(): Promise<OrderSummaryDTO> {
    const resp = await authFetch(`${BACKEND_URL}/invoices/checkout`, {
        method: "POST"
    });
    if (!resp.ok) throw new Error("Checkout failed");
    return resp.json();
}

export async function payInvoice(invoiceId: number, method: string = "CARD"): Promise<InvoiceDTO> {
    const resp = await authFetch(`${BACKEND_URL}/payments`, {
        method: "POST",
        body: JSON.stringify({ invoiceId, paymentMethod: method }),
        headers: { "Content-Type": "application/json" }
    });

    if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || "Payment failed");
    }
    return resp.json();
}

export async function claimProduct(productId: number): Promise<void> {
    const resp = await authFetch(`${BACKEND_URL}/products/${productId}/claim`, { method: "PUT" });
    if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.message || "Failed to claim product");
    }
}

export async function unclaimProduct(productId: number): Promise<void> {
    const resp = await authFetch(`${BACKEND_URL}/products/${productId}/unclaim`, { method: "PUT" });
    if (!resp.ok) throw new Error("Could not eliminate product.");
}

export async function reviewAccountRequest(id: number, approve: boolean, assignedRole?: string): Promise<AccountRequestType> {
    const body = { approve, assignedRole: approve ? assignedRole : null };
    const resp = await authFetch(`${BACKEND_URL}/admin/account-requests/${id}/review`, {
        method: "PUT",
        body: JSON.stringify(body)
    });
    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function fetchMyInvoices(): Promise<OrderSummaryDTO[]> {
    const resp = await authFetch(`${BACKEND_URL}/invoices`);
    if (!resp.ok) throw new Error("Failed to fetch invoices");
    return resp.json();
}

export async function fetchInvoiceDetails(id: number): Promise<InvoiceDTO> {
    const resp = await authFetch(`${BACKEND_URL}/invoices/${id}`);
    if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.message || "Failed to fetch invoice details");
    }
    return resp.json();
}

export async function fetchMyCart(): Promise<ShoppingCartDTO> {
    const resp = await authFetch(`${BACKEND_URL}/cart`);
    if (!resp.ok) throw new Error("Failed to fetch cart");
    return resp.json();
}

export async function addToCart(productId: number, quantity: number): Promise<ShoppingCartDTO> {
    const resp = await authFetch(`${BACKEND_URL}/cart/items`, {
        method: "POST",
        body: JSON.stringify({ productId, quantity })
    });
    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function removeFromCart(cartItemId: number): Promise<void> {
    const resp = await authFetch(`${BACKEND_URL}/cart/items/${cartItemId}`, {
        method: "DELETE"
    });
    if (!resp.ok) throw new Error("Failed to remove item");
}

export async function performCheckout(billingData: CheckoutRequestDTO): Promise<OrderSummaryDTO> {
    const resp = await authFetch(`${BACKEND_URL}/invoices/checkout`, {
        method: "POST",
        body: JSON.stringify(billingData)
    });

    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function payInvoice(invoiceId: number): Promise<InvoiceDTO> {
    const resp = await authFetch(`${BACKEND_URL}/payments`, {
        method: "POST",
        body: JSON.stringify({
            invoiceId: invoiceId,
            paymentMethod: "CARD"
        })
    });

    if (!resp.ok) await handleError(resp);
    return resp.json();
}

export async function generateAndOpenPdf(invoiceData: InvoiceDTO) {
    const element = React.createElement(InvoiceDocument, { invoice: invoiceData }) as any;
    const blob = await pdf(element).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

export async function sendInvoiceToEmail(invoiceId: number, email: string): Promise<void> {
    const resp = await authFetch(`${BACKEND_URL}/invoices/${invoiceId}/send-email?email=${encodeURIComponent(email)}`, {
        method: "POST"
    });

    if (!resp.ok) await handleError(resp);
}