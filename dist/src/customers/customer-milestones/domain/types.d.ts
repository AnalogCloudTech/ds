import { SchemaId } from '@/internal/types/helpers';
export type CustomerMilestonesDto = {
    _id: SchemaId;
    milestones: {
        milestoneName: CustomerMilestonesName;
        status: CustomerMilestoneStatus;
    };
    firstName: string;
    lastName: string;
    email: string;
    status: string;
};
export declare enum CustomerMilestoneStatus {
    PENDING = "pending",
    COMPLETED = "completed"
}
export declare enum CustomerMilestonesName {
    GENERATED_BOOK = "generated_book",
    LAST_LOGIN = "last_login",
    PROFILE_PICTURE = "profile_picture",
    LEADS = "leads",
    PRINTED_BOOK = "printed_book",
    EMAIL_CAMPAIGN = "email_campaign"
}
