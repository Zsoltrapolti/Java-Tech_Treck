import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/form/AuthContext.tsx";

export function RoleRoute({ allowed }: { allowed: UserRole[] }) {
    const { role } = useAuth();
        
        const savedRole = localStorage.getItem("role") as UserRole | null;
        const currentRole = role || savedRole;

        if (!currentRole) {
            return <Navigate to="/" replace />;
        }
    if (!allowed.includes(currentRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}