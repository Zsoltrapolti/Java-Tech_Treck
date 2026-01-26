// frontend/src/pages/admin/AccountRequestsPage.tsx
import { useEffect, useState } from "react";

interface AccountRequest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | string;
    createdAt?: string;
}

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    try {
        return String(e);
    } catch {
        return "Unknown error";
    }
}

export default function AccountRequestsPage() {
    const [requests, setRequests] = useState<AccountRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchRequests() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/account-requests", {
                method: "GET",
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error(`Failed to load (${res.status})`);
            const data: AccountRequest[] = await res.json();
            setRequests(data);
        } catch (e: unknown) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    async function handleApprove(id: number) {
        try {
            const res = await fetch(`/api/account-requests/${id}/approve`, {
                method: "PUT",
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error(`Approve failed (${res.status})`);
            await fetchRequests();
        } catch (e: unknown) {
            setError(`Approve error: ${getErrorMessage(e)}`);
        }
    }

    async function handleDeny(id: number) {
        try {
            const res = await fetch(`/api/account-requests/${id}/deny`, {
                method: "PUT",
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error(`Deny failed (${res.status})`);
            await fetchRequests();
        } catch (e: unknown) {
            setError(`Deny error: ${getErrorMessage(e)}`);
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm("Delete this request permanently?")) return;
        try {
            const res = await fetch(`/api/account-requests/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error(`Delete failed (${res.status})`);
            await fetchRequests();
        } catch (e: unknown) {
            setError(`Delete error: ${getErrorMessage(e)}`);
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Account Requests (admin)</h2>
            {error && (
                <div style={{ color: "red", marginBottom: 12 }}>
                    Error: {error}
                </div>
            )}
            <div style={{ marginBottom: 12 }}>
                <button onClick={fetchRequests} disabled={loading}>
                    Refresh
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : requests.length === 0 ? (
                <div>No account requests found.</div>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>ID</th>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Name</th>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Email</th>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Status</th>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Created</th>
                        <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((r) => (
                        <tr key={r.id}>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.id}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.lastName} {r.firstName}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.email}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  <span
                      style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          background:
                              r.status === "APPROVED" ? "#d4edda" : r.status === "REJECTED" ? "#f8d7da" : "#fff3cd",
                          color: "#333",
                          fontWeight: 600,
                      }}
                  >
                    {r.status}
                  </span>
                            </td>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.createdAt ?? "-"}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                                <button
                                    onClick={() => handleApprove(r.id)}
                                    disabled={r.status !== "PENDING"}
                                    style={{ marginRight: 8 }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDeny(r.id)}
                                    disabled={r.status !== "PENDING"}
                                    style={{ marginRight: 8 }}
                                >
                                    Deny
                                </button>
                                <button onClick={() => handleDelete(r.id)} style={{ color: "white", background: "#d9534f" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
