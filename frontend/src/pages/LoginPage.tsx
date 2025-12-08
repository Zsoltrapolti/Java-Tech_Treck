import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/backend";

import {
    LoginContainer,
    LoginCard,
    LoginTitle,
    LoginSubtitle,
    FieldLabel,
    StyledTextField,
    StyledButton,
    ErrorText
} from "../styles/LoginPage.styles";

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
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                </form>
            </LoginCard>
        </LoginContainer>
    );
}
