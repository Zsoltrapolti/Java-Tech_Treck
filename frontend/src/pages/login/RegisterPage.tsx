import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, registerUser } from "../../api/backend";
import { useAuth } from "../../components/form/AuthContext";
import type { UserRole } from "../../types/Auth";

import {
    FieldLabel,
    StyledTextField,
    StyledButton
} from "../../ui/LoginPage.styles";

import { AuthForm } from "../../components/form/AuthForm";
import { AuthFooter } from "../../components/form/AuthFooter";
import { MenuItem } from "@mui/material";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { setRole: setAuthRole } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("USER");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            await registerUser(username, password, role);

            const loggedRole = await login(username, password);
            setAuthRole(loggedRole);

            navigate(
                loggedRole === "ADMIN"
                    ? "/employees"
                    : loggedRole === "EMPLOYEE"
                        ? "/stock"
                        : "/products"
            );
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
    }

    return (
        <AuthForm
            title="Create an Account"
            subtitle="Register to browse products"
            onSubmit={handleSubmit}
            error={error}
            footer={
                <AuthFooter
                    text="Already have an account?"
                    linkText="Login"
                    onClick={() => navigate("/")}
                />
            }
        >
            <FieldLabel>Username</FieldLabel>
            <StyledTextField
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
            />

            <FieldLabel>Password</FieldLabel>
            <StyledTextField
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
            />

            <FieldLabel>Role</FieldLabel>
            <StyledTextField
                select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                fullWidth
            >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
            </StyledTextField>

            <StyledButton type="submit" fullWidth>
                Register
            </StyledButton>
        </AuthForm>
    );
}
