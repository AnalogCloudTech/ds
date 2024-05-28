import { SetCustomerPasswordDTO } from '@/onboard/upsell/dto/set-customer-password.dto';
import { MarketingAndSalesParamsDTO } from '@/onboard/upsell/dto/market-and-sales-params.dto';
import { UpsellService } from '@/onboard/upsell/upsell.service';
import { Paginator } from '@/internal/utils/paginator';
import { ColumnFilterDto, FindUpsellReportDto, UpsellCSVExportDTO } from '@/onboard/upsell/dto/find-upsell-report.dto';
import { SchemaId } from '@/internal/types/helpers';
export declare class UpsellController {
    private readonly upsellService;
    constructor(upsellService: UpsellService);
    setCustomerPassword(dto: SetCustomerPasswordDTO): Promise<string>;
    updateParams(MarketingAndSalesParams: MarketingAndSalesParamsDTO): Promise<import("../schemas/session.schema").SessionDocument>;
    findAllPaginated(dto: FindUpsellReportDto, filter: ColumnFilterDto, { page, perPage }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("./schemas/tw-upsell.schema").TWUpsellDocument>>;
    sendCsvToEmail(dto: UpsellCSVExportDTO): Promise<{
        formattedData: import("./types/types").FormattedUpsellCSV[];
        email: string;
    }>;
    deleteRecord(id: SchemaId): Promise<import("./schemas/tw-upsell.schema").TWUpsellDocument>;
}
