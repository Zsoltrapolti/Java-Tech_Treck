import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/backend.ts";

import {
    LoginContainer,
    LoginCard,
    LoginTitle,
    LoginSubtitle,
    FieldLabel,
    StyledTextField,
    StyledButton,
    ErrorText, LoginForm
} from "../ui/LoginPage.styles.ts";

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await login(username, password);
            navigate("/home");
        } catch {
            setError("Invalid username or password");
        }
    }

    return (
        <LoginContainer>
            <LoginCard elevation={6}>
                <LoginForm onSubmit={handleSubmit}>
                    <LoginTitle variant="h4">Krumpi Management System</LoginTitle>
                    <LoginSubtitle variant="subtitle1">Please sign in to continue</LoginSubtitle>

                    <FieldLabel variant="subtitle2">Username</FieldLabel>
                    <StyledTextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />

                    <FieldLabel variant="subtitle2">Password</FieldLabel>
                    <StyledTextField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />

                    <StyledButton type="submit" variant="contained" fullWidth>
                        Login
                    </StyledButton>

                    {error && <ErrorText variant="body2">{error}</ErrorText>}
                </LoginForm>
            </LoginCard>
        </LoginContainer>
    );
}
