// language: typescript
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/backend";

import {
    FieldLabel,
    StyledTextField,
    StyledButton
} from "../../ui/LoginPage.styles";

import { AuthForm } from "../../components/form/AuthForm";
import { AuthFooter } from "../../components/form/AuthFooter";
import { useAuth } from "../../components/form/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { setRole } = useAuth();

    // Use FormEvent<Element> to match the parent prop and return void.
    function handleSubmit(e: FormEvent<Element>): void {
        e.preventDefault();
        setError(null);

        // run async logic in an IIFE so the outer handler stays synchronous
        void (async () => {
            try {
                const role = await login(username, password);
                setRole(role);

                switch (role) {
                    case "ADMIN":
                        navigate("/account-requests");
                        break;
                    case "EMPLOYEE":
                        navigate("/stock");
                        break;
                    case "USER":
                    default:
                        navigate("/products");
                        break;
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Invalid username or password");
            }
        })();
    }

    return (
        <AuthForm
            title="Krumpi Management System"
            subtitle="Please sign in to continue"
            onSubmit={handleSubmit}
            error={error}
            footer={
                <AuthFooter
                    text="Don’t have an account?"
                    linkText="Create one"
                    onClick={() => navigate("/register")}
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
                Login
            </StyledButton>

            <StyledButton
                type="button"
                fullWidth
                onClick={() => navigate("/request-account")}
                style={{ marginTop: 12 }}
            >
                Request Account
            </StyledButton>
        </AuthForm>
    );
}
