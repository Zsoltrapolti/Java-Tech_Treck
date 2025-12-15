export type UserRole = "USER" | "EMPLOYEE" | "ADMIN";

export function getUserRole(): UserRole | null {
    const role = localStorage.getItem("role");

    if (role === "USER" || role === "EMPLOYEE" || role === "ADMIN") {
        return role;
    }

    return null;
}
