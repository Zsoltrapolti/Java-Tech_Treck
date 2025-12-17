import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/form/AuthContext";

export function RoleRoute({ allowed }: { allowed: string[] }) {
    const { role, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!role) {
        return <Navigate to="/" replace />;
    }

    if (!allowed.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
