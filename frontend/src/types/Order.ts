import type {EmployeeType} from "./Employee.ts";

export interface OrderType {
    id: number;
    customerName: string;
    creationDate: Date;
    status: string;
    responsibleEmployee: EmployeeType;
}