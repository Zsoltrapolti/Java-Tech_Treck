import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, registerUser } from "../../api/backend";
import { useAuth } from "../../components/form/AuthContext";

import {
    FieldLabel,
    StyledTextField,
    StyledButton
} from "../../ui/LoginPage.styles";

import { AuthForm } from "../../components/form/AuthForm";
import { AuthFooter } from "../../components/form/AuthFooter";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { setRole: setAuthRole } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            // send only username + password; backend will assign role
            await registerUser(username, password);

            const loggedRole = await login(username, password);
            setAuthRole(loggedRole);

            navigate(
                loggedRole === "ADMIN"
                    ? "/employees"
                    : loggedRole === "EMPLOYEE"
                        ? "/stock"
                        : "/products"
            );
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err) || "Registration failed");
            }
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

            <StyledButton type="submit" fullWidth>
                Register
            </StyledButton>
        </AuthForm>
    );
}
