import {
    AuthFooterContainer,
    AuthFooterText,
    AuthFooterLink,
} from "../../ui/AuthFooter.styles";

export function AuthFooter({
                               text,
                               linkText,
                               onClick,
                           }: {
    text: string;
    linkText: string;
    onClick: () => void;
}) {
    return (
        <AuthFooterContainer>
            <AuthFooterText>{text}</AuthFooterText>
            <AuthFooterLink onClick={onClick}>
                {linkText}
            </AuthFooterLink>
        </AuthFooterContainer>
    );
}
