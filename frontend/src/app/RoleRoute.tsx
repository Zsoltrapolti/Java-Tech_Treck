import { Navigate, Outlet } from "react-router-dom";
import { getUserRole, type UserRole } from "../api/auth";

export function RoleRoute({ allowed }: { allowed: UserRole[] }) {
    const role = getUserRole();

    if (!role) {
        return <Navigate to="/" replace />;
    }

    if (!allowed.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
