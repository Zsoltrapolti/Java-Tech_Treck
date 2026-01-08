import type {OrderItemType} from "./OrderItem.ts";

export interface OrderType{
    id?: number;
    customerName: string;
    responsibleEmployeeId: number;
    items: OrderItemType[];
}