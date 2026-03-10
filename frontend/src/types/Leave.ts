import type { EmployeeType } from "./Employee";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveRequestType {
    id: number;
    employee: EmployeeType;
    startDate: string;
    endDate: string;
    requestedDays: number;
    status: LeaveStatus;
}

export interface LeaveRequestDTO {
    employeeId: number;
    startDate: string;
    endDate: string;
}