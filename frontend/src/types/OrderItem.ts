import type {OrderType} from "./Order.ts";
import type {ProductType} from "./Product.ts";

export interface OrderItemType {
    id: number;
    order: OrderType;
    product: ProductType;
    quantity: number;
    unitPrice: number;
}