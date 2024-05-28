import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { ZoomPhoneUserDocument } from '@/legacy/dis/legacy/zoom/schemas/zoom-phone-user.schema';
import { Model } from 'mongoose';
export declare class ZoomPhoneUserRepository extends GenericRepository<ZoomPhoneUserDocument> {
    protected readonly model: Model<ZoomPhoneUserDocument>;
    constructor(model: Model<ZoomPhoneUserDocument>);
    getUniqueHostMail(email?: string): Promise<string[]>;
}
