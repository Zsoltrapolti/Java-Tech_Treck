import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../components/form/AuthContext.tsx";

export type UserRole = "USER" | "EMPLOYEE" | "ADMIN";

export function RoleRoute({ allowed }: { allowed: UserRole[] }) {
    const { role } = useAuth();

    if (!role) {
        return <Navigate to="/" replace />;
    }

    if (!allowed.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
