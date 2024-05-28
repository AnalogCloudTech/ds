import { SessionService } from '@/onboard/services/session.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { SetCustomerPasswordDTO } from '@/onboard/upsell/dto/set-customer-password.dto';
import { MarketingAndSalesParamsDTO } from '@/onboard/upsell/dto/market-and-sales-params.dto';
import { SessionDocument } from '../schemas/session.schema';
import { TwUpsellRepository } from '@/onboard/upsell/upsell.repository';
import { CreateUpsellReportDto } from '@/onboard/upsell/dto/create-upsell-report.dto';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { TWUpsellDocument } from '@/onboard/upsell/schemas/tw-upsell.schema';
import { ColumnFilterDto, FindUpsellReportDto, UpsellCSVExportDTO } from '@/onboard/upsell/dto/find-upsell-report.dto';
import { SchemaId } from '@/internal/types/helpers';
import { Queue } from 'bull';
export declare class UpsellService {
    private readonly sessionService;
    private readonly hubspotService;
    private readonly twUpsellRepository;
    private csvSenderQueue;
    constructor(sessionService: SessionService, hubspotService: HubspotService, twUpsellRepository: TwUpsellRepository, csvSenderQueue: Queue);
    setCustomerPassword(dto: SetCustomerPasswordDTO): Promise<string>;
    updateSessionWithParams(dto: MarketingAndSalesParamsDTO): Promise<SessionDocument>;
    create(dto: CreateUpsellReportDto): Promise<TWUpsellDocument>;
    createMany(dtos: CreateUpsellReportDto[]): Promise<TWUpsellDocument[]>;
    findAllPaginated(dto: FindUpsellReportDto, filter: ColumnFilterDto, page: number, perPage: number): Promise<PaginatorSchematicsInterface<TWUpsellDocument>>;
    deleteRecord(id: SchemaId): Promise<TWUpsellDocument>;
    sendCsvToEmail(dto: UpsellCSVExportDTO, filter?: ColumnFilterDto): Promise<{
        formattedData: import("./types/types").FormattedUpsellCSV[];
        email: string;
    }>;
}
