export interface CartItemType {
    id: number;
    productId: number;
    productName: string;
    unitOfMeasure: string;
    pricePerUnit: number;
    quantity: number;
    totalLinePrice: number;
}

export interface ShoppingCartDTO {
    id: number;
    items: CartItemType[];
    grandTotal: number;
}