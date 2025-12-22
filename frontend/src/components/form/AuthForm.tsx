import type { ReactNode } from "react";
import {
    LoginContainer,
    LoginCard,
    LoginTitle,
    LoginSubtitle,
    ErrorText,
    LoginForm
} from "../../ui/LoginPage.styles";

export function AuthForm({
                             title,
                             subtitle,
                             onSubmit,
                             error,
                             footer,
                             children,
                         }: {
    title: string;
    subtitle: string;
    onSubmit: (e: React.FormEvent) => void;
    error?: string | null;
    footer?: ReactNode;
    children: ReactNode;
}) {
    return (
        <LoginContainer>
            <LoginCard elevation={6}>
                <LoginForm onSubmit={onSubmit}>
                    <LoginTitle variant="h4">{title}</LoginTitle>
                    <LoginSubtitle variant="subtitle1">
                        {subtitle}
                    </LoginSubtitle>

                    {children}

                    {error && <ErrorText>{error}</ErrorText>}

                    {footer}
                </LoginForm>
            </LoginCard>
        </LoginContainer>
    );
}
