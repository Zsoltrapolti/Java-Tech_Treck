import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, logout } from "../../api/backend";

export type UserRole = "USER" | "EMPLOYEE" | "ADMIN";

type AuthContextType = {
    role: UserRole | null;
    setRole: (role: UserRole | null) => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initAuth() {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const me = await fetchMe();
                setRole(me.role);
            } catch {
                logout();
                setRole(null);
            } finally {
                setLoading(false);
            }
        }

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ role, setRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
