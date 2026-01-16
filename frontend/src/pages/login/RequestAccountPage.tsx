// File: frontend/src/pages/login/RequestAccountPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestAccount, checkRequestStatus } from "../../api/backend";

import {
    FieldLabel,
    StyledTextField,
    StyledButton
} from "../../ui/LoginPage.styles";

import { AuthForm } from "../../components/form/AuthForm";
import { AuthFooter } from "../../components/form/AuthFooter";

export default function RequestAccountPage() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setStatusMessage(null);

        if (!firstName || !lastName || !email) {
            setError("All fields are required");
            return;
        }

        try {
            await requestAccount(firstName, lastName, email);
            setSuccess("Account request submitted successfully! You will be notified via email once approved.");

            // Clear form
            setFirstName("");
            setLastName("");
            setEmail("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to submit account request");
            }
        }
    }

    async function handleCheckStatus() {
        setError(null);
        setSuccess(null);
        setStatusMessage(null);

        if (!email) {
            setError("Please enter your email to check status");
            return;
        }

        try {
            const status = await checkRequestStatus(email);
            setStatusMessage(`Request Status: ${status}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to check request status");
            }
        }
    }

    return (
        <AuthForm
            title="Request Account"
            subtitle="Submit a request to create an account"
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
            {success && (
                <div style={{
                    padding: "12px",
                    marginBottom: "16px",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    borderRadius: "4px",
                    border: "1px solid #c3e6cb"
                }}>
                    {success}
                </div>
            )}

            {statusMessage && (
                <div style={{
                    padding: "12px",
                    marginBottom: "16px",
                    backgroundColor: "#d1ecf1",
                    color: "#0c5460",
                    borderRadius: "4px",
                    border: "1px solid #bee5eb"
                }}>
                    {statusMessage}
                </div>
            )}

            <FieldLabel>First Name</FieldLabel>
            <StyledTextField
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                fullWidth
            />

            <FieldLabel>Last Name</FieldLabel>
            <StyledTextField
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                fullWidth
            />

            <FieldLabel>Email</FieldLabel>
            <StyledTextField
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
            />

            <StyledButton type="submit" fullWidth>
                Send Request
            </StyledButton>

            <StyledButton
                type="button"
                fullWidth
                onClick={handleCheckStatus}
                style={{ marginTop: 12 }}
            >
                Check Request Status
            </StyledButton>
        </AuthForm>
    );
}