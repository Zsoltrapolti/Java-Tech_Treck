export interface AccountRequestType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "REGISTERED";
    assignedRole?: string;
}