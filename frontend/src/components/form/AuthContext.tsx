import { createContext, useContext, useState } from "react";

export type UserRole = "USER" | "EMPLOYEE" | "ADMIN";

type AuthContextType = {
    role: UserRole | null;
    setRole: (role: UserRole | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole | null>(
        localStorage.getItem("role") as UserRole | null
    );

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
