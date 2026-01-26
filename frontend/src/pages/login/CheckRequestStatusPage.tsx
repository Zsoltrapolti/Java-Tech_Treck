// File: frontend/src/pages/login/CheckRequestStatusPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkRequestStatus } from "../../api/backend";

import {
    FieldLabel,
    StyledTextField,
    StyledButton
} from "../../ui/LoginPage.styles";

import { AuthForm } from "../../components/form/AuthForm";
import { AuthFooter } from "../../components/form/AuthFooter";

type StatusInfo = {
    status: "PENDING" | "APPROVED" | "REJECTED" | "REGISTERED";
    message: string;
    color: string;
    backgroundColor: string;
};

export default function CheckRequestStatusPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);

    async function handleCheckStatus(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setStatusInfo(null);

        if (!email) {
            setError("Please enter your email");
            return;
        }

        try {
            const data = await checkRequestStatus(email);

            // Normalize response: API may return a string or an object with { status }
            const statusStr: string = typeof data === "string"
                ? data
                : (data as any)?.status ?? String(data);

            const statusKey = statusStr as StatusInfo["status"];

            let info: StatusInfo;

            switch (statusKey) {
                case "PENDING":
                    info = {
                        status: "PENDING",
                        message: "Your account request is pending review. An administrator will process it soon.",
                        color: "#856404",
                        backgroundColor: "#fff3cd"
                    };
                    break;
                case "APPROVED":
                    info = {
                        status: "APPROVED",
                        message: "Your account has been approved! You can now register using the email you provided.",
                        color: "#0c5460",
                        backgroundColor: "#d1ecf1"
                    };
                    break;
                case "REJECTED":
                    info = {
                        status: "REJECTED",
                        message: "Your account request has been rejected. Please contact an administrator for more information.",
                        color: "#721c24",
                        backgroundColor: "#f8d7da"
                    };
                    break;
                case "REGISTERED":
                    info = {
                        status: "REGISTERED",
                        message: "Your account is fully registered! You can now login.",
                        color: "#155724",
                        backgroundColor: "#d4edda"
                    };
                    break;
                default:
                    // If server returned an unexpected string, map to a generic unknown status visually
                    info = {
                        status: statusKey ?? "PENDING",
                        message: "Status unknown.",
                        color: "#383d41",
                        backgroundColor: "#e2e3e5"
                    };
            }

            setStatusInfo(info);
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
            title="Check Request Status"
            subtitle="Enter your email to check your account request status"
            onSubmit={handleCheckStatus}
            error={error}
            footer={
                <AuthFooter
                    text="Want to go back?"
                    linkText="Login"
                    onClick={() => navigate("/")}
                />
            }
        >
            {statusInfo && (
                <div style={{
                    padding: "16px",
                    marginBottom: "20px",
                    backgroundColor: statusInfo.backgroundColor,
                    color: statusInfo.color,
                    borderRadius: "8px",
                    border: `1px solid ${statusInfo.color}40`,
                    lineHeight: "1.5"
                }}>
                    <strong style={{ fontSize: "16px", display: "block", marginBottom: "8px" }}>
                        Status: {statusInfo.status}
                    </strong>
                    {statusInfo.message}

                    {statusInfo.status === "APPROVED" && (
                        <div style={{ marginTop: "12px" }}>
                            <StyledButton
                                type="button"
                                onClick={() => navigate("/register")}
                                style={{ width: "100%" }}
                            >
                                Go to Registration
                            </StyledButton>
                        </div>
                    )}

                    {statusInfo.status === "REGISTERED" && (
                        <div style={{ marginTop: "12px" }}>
                            <StyledButton
                                type="button"
                                onClick={() => navigate("/")}
                                style={{ width: "100%" }}
                            >
                                Go to Login
                            </StyledButton>
                        </div>
                    )}
                </div>
            )}

            <FieldLabel>Email</FieldLabel>
            <StyledTextField
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                placeholder="Enter your email address"
            />

            <StyledButton type="submit" fullWidth>
                Check Status
            </StyledButton>
        </AuthForm>
    );
}
