import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Model } from 'mongoose';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AttributesDocument } from './schemas/attributes.schemas';
export declare class AttributesService {
    private readonly attributeModel;
    constructor(attributeModel: Model<AttributesDocument>);
    create(customer: CustomerDocument, createAttributeDto: CreateAttributeDto): Promise<AttributesDocument>;
    findAll(page: number, perPage: number): Promise<PaginatorSchematicsInterface>;
    findOne(id: string): Promise<AttributesDocument>;
    update(id: string, updateAttributeDto: UpdateAttributeDto): Promise<AttributesDocument>;
    remove(id: string): Promise<AttributesDocument>;
    findAllByCustomerId(customer: CustomerDocument): import("mongoose").Query<(import("./schemas/attributes.schemas").Attribute & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[], import("./schemas/attributes.schemas").Attribute & import("mongoose").Document<any, any, any> & {
        _id: any;
    }, {}, AttributesDocument>;
}
