export declare class Product {
    title: string;
    quantity: number;
    unit_price: number;
}
declare class InvoiceInfo {
    line_items: Product[];
}
export declare class CreateInvoiceDto {
    invoice: InvoiceInfo;
}
declare class Void {
    reason: string;
}
export declare class VoidInvoiceDto {
    void: Void;
}
export {};
