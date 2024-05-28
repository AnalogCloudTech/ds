import { Logger } from '@nestjs/common';
import { HubspotService } from './hubspot.service';
import { CreateTicketDto } from './dto/createTicket.dto';
import { UpdateContactDto } from './dto/create-contact.dto';
import { UpdateCreditsAndPackagesDto } from './dto/updateCreditsAndPackages.dto';
import { AddContactToWorkFlowDto, ContactToWorkFlowDto } from './dto/addContactToWorkFlow.dto';
import { ContactDto, UpdateAfyPasswordDto, UpdateProfileAvatarDto } from './dto/contact.dto';
import { BlogPost } from '@hubspot/api-client/lib/codegen/cms/blogs/blog_posts/api';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FormSubmissionObject, MessageErrorObj } from './domain/types';
import { ProductVerificationStatus, VerifyProductDto } from './dto/products.dto';
import { FormSubmissionDto } from '@/legacy/dis/legacy/hubspot/dto/form-submission.dto';
export declare class HubspotController {
    private readonly hubspotService;
    private readonly logger;
    constructor(hubspotService: HubspotService, logger: Logger);
    register(): string;
    createTicket(createTicketDto: CreateTicketDto): Promise<import("./dto/createTicket.dto").CreateTicketResponseDto>;
    getAutoLoginToken(id: string): Promise<string | false>;
    authenticate(email: string, password: string): Promise<boolean>;
    createOrUpdateContact(customer: CustomerDocument, contact: ContactDto): Promise<string>;
    UpdateCreditsAndPackages(data: UpdateCreditsAndPackagesDto): Promise<{
        [x: string]: string;
    }>;
    addContactToWorkFlow(data: AddContactToWorkFlowDto): Promise<string>;
    updateContactByTicketId(id: string, contact: UpdateContactDto): Promise<string>;
    getContactDetailsByEmail(contactEmail: string): Promise<object>;
    isAdmin(email: string): Promise<{
        isAdmin: boolean;
    }>;
    updateAfyPassword(customer: CustomerDocument, dto: UpdateAfyPasswordDto): Promise<string>;
    updateProfileAvatar(dto: UpdateProfileAvatarDto): Promise<string>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    autoEnrollHsContactWorkflow(data: ContactToWorkFlowDto): Promise<MessageErrorObj>;
    verifyHubspotProduct(body: VerifyProductDto): Promise<ProductVerificationStatus>;
    submitHSForms(dto: FormSubmissionDto): Promise<FormSubmissionObject>;
}
