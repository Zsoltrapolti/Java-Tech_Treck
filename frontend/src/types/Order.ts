import type {OrderItemType} from "./OrderItem.ts";
export type OrderStatus = 'PENDING' | 'DONE' | 'UPCOMING' | 'NEW';

export interface OrderType{
    id?: number;
    customerName: string;
    responsibleEmployeeId: number;
    creationDate: string;
    status: OrderStatus;
    items: OrderItemType[];
}