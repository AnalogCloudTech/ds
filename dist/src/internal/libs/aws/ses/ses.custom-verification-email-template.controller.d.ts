import { CreateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/create-custom-verification-email.dto';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { UpdateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/update-custom-verification-email.dto';
export declare class SesCustomVerificationEmailTemplateController {
    private readonly sesService;
    constructor(sesService: SesService);
    create(dto: CreateCustomVerificationEmailDto): Promise<{
        $response: import("aws-sdk").Response<{}, import("aws-sdk").AWSError>;
    }>;
    get(name: string): Promise<import("aws-sdk/clients/ses").CustomVerificationEmailTemplate>;
    update(name: string, dto: UpdateCustomVerificationEmailDto): Promise<{
        $response: import("aws-sdk").Response<{}, import("aws-sdk").AWSError>;
    }>;
}
