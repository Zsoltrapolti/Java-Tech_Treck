export interface InvoiceItem {
    id: number;
    productName: string;
    unitOfMeasure: string;
    quantity: number;
    pricePerUnit: number;
    totalValue: number;
}

export interface InvoiceDTO {
    id: number;
    series: string;
    number: string;
    date: string;
    supplierName: string;
    supplierCui: string;
    supplierReg: string;
    supplierAddress: string;
    supplierBank: string;
    supplierIban: string;
    clientName: string;
    clientAddress: string;
    items: InvoiceItem[];
    totalNet: number;
    totalVat: number;
    totalGross: number;
}

export interface OrderSummaryDTO {
    orderId: number;
    description: string;
    totalToPay: number;
    status: "PENDING_PAYMENT" | "PAID" | "CANCELLED";
}