import type {ProductType} from "./Product.ts";

export interface StockEntryType{
    id: number;
    product: ProductType;
    quantity: number;
}