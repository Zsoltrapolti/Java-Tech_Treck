import { AddButton, ModulePageHeader } from "../../ui/ModulePage.styles.ts";

export function ModuleHeader({
                               title,
                               onAdd,
                               addLabel
                           }: {
    title: string;
    onAdd: () => void;
    addLabel: string;
}) {
    return (
        <>
            <ModulePageHeader>
                {title}
            </ModulePageHeader>

            <AddButton onClick={onAdd}>
                {addLabel}
            </AddButton>
        </>
    );
}
