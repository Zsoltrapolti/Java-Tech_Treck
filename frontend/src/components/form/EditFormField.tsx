import { EditLabel, EditInput } from "../../ui/ModulePageEdit.styles.ts";

export function EditFormField({ label, value, onChange, type = "text" }: {
    label: string;
    value: any;
    type?: string;
    onChange: (v: any) => void;
}) {
    return (
        <>
            <EditLabel>{label}</EditLabel>
            <EditInput
                variant="outlined"
                value={value}
                type={type}
                onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
            />
        </>
    );
}
