import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { ZoomMemberDocument } from '@/legacy/dis/legacy/zoom/schemas/zoom-member.schema';
import { Model } from 'mongoose';
export declare class ZoomMemberRepository extends GenericRepository<ZoomMemberDocument> {
    protected readonly model: Model<ZoomMemberDocument>;
    constructor(model: Model<ZoomMemberDocument>);
    findByEmail(email: string): Promise<ZoomMemberDocument>;
}
