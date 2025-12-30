import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "USER" | "EMPLOYEE" | "ADMIN";

interface AuthContextType {
    role: UserRole | null;
    setRole: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<UserRole | null>(() => {
        return localStorage.getItem("role") as UserRole | null;
    });

    const setRole = (newRole: UserRole | null) => {
        setRoleState(newRole);
        if (newRole) {
            localStorage.setItem("role", newRole);
        } else {
            localStorage.removeItem("role");
            localStorage.removeItem("authToken");
        }
    };

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}