export type PaymentPlansQueryFilters = {
    filters: {
        plusPlan: string | null;
    };
};
interface AvailablePlanTypes {
    monthly: string;
    annually: string;
}
interface ProductPlansAttributes {
    amount: AvailablePlanTypes;
    buttonText: AvailablePlanTypes;
    createdAt: string;
    digitalBooks: string;
    leadCaptureWebsites: string;
    licensedBooks: string;
    planName: string;
    plusPlan: boolean;
    priceId: AvailablePlanTypes;
    printedBooks: string;
    publishedAt: string;
    saveAmount: number;
    updatedAt: string;
}
export type ProductPlans = {
    attributes: ProductPlansAttributes;
    id: number;
    componentId: number;
};
export type ComponentInfo = {
    componentId: string;
    componentUnitPrice: string;
};
export interface ProductPackages {
    id: number;
    attributes: ProductPackageAttributes;
}
export interface ProductPackageAttributes extends ProductPlansAttributes {
    paidAnnually: string;
    paidMonthly: string;
    priceIdMonthly: string;
    priceIdAnnually: string;
}
export {};
