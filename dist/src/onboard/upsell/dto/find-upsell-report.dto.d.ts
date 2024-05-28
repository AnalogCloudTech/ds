export declare class FindUpsellReportDto {
    search?: string;
    startDate: string;
    endDate: string;
    sortBy?: {
        [key: string]: number;
    };
}
export declare class ColumnFilterDto {
    customerEmail?: string;
    offerName?: string;
    channel?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
}
export declare class UpsellCSVExportDTO {
    reportIds?: string[];
    email: string;
    search?: string;
    startDate: string;
    endDate: string;
    sortBy?: {
        [key: string]: number;
    };
    filter?: ColumnFilterDto;
}
