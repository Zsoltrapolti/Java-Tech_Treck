import type {ReactNode} from "react";
import {
    EditContainer,
    EditCard,
    EditTitle,
} from "../../ui/ModulePageEdit.styles.ts";

export function EditFormPage({ title, children }: {
    title: string;
    children: ReactNode;
}) {
    return (
        <EditContainer>
            <EditCard elevation={6}>
                <EditTitle>{title}</EditTitle>
                {children}
            </EditCard>
        </EditContainer>
    );
}
