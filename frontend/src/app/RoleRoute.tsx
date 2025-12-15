import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../api/backend.ts";

export function RoleRoute({ allowed }: { allowed: string[] }) {
    const role = getUserRole();

    if (!role) {
        return <Navigate to="/" replace />;
    }

    if (!allowed.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
