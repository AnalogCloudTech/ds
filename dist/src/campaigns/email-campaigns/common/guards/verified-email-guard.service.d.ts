import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { CustomersService } from '@/customers/customers/customers.service';
export declare class VerifiedEmailGuard implements CanActivate {
    private readonly sesService;
    private readonly customersService;
    constructor(sesService: SesService, customersService: CustomersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
