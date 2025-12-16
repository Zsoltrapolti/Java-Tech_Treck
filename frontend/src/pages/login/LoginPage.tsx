import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/backend";

import {
    FieldLabel,
    StyledTextField,
    StyledButton
} from "../../ui/LoginPage.styles";

import { AuthForm } from "../../components/form/AuthForm";
import { AuthFooter } from "../../components/form/AuthFooter";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            const role = await login(username, password);

            switch (role) {
                case "ADMIN":
                    navigate("/employees");
                    break;

                case "EMPLOYEE":
                    navigate("/stock");
                    break;

                case "USER":
                default:
                    navigate("/products");
                    break;
            }

        } catch {
            setError("Invalid username or password");
        }
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
        </AuthForm>
    );
}
