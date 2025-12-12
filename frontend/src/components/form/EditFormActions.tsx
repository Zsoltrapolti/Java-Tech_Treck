import { SaveButton, BackButton, FormActionsWrapper } from "../../ui/ModulePageEdit.styles.ts";

export function EditFormActions({ onSave, onCancel }: {
    onSave: () => void;
    onCancel: () => void;
}) {
    return (
        <FormActionsWrapper>
            <SaveButton variant="contained" onClick={onSave}>Save</SaveButton>
            <BackButton variant="contained" onClick={onCancel}>Cancel</BackButton>
        </FormActionsWrapper>
    );
}
