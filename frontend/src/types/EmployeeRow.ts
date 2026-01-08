export type RowSource = "EMPLOYEE" | "USER";

export interface EmployeeRowType {
    id: string;
    rawId: number;
    source: RowSource;
    firstName: string;
    lastName: string;
    role: string;
}
