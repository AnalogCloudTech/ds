/// <reference types="mongoose" />
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class AttributesController {
    private readonly attributesService;
    constructor(attributesService: AttributesService);
    findAllByCutomerId(customer: CustomerDocument): import("mongoose").Query<(import("./schemas/attributes.schemas").Attribute & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[], import("./schemas/attributes.schemas").Attribute & import("mongoose").Document<any, any, any> & {
        _id: any;
    }, {}, import("./schemas/attributes.schemas").AttributesDocument>;
    create(customer: CustomerDocument, createAttributeDto: CreateAttributeDto): Promise<import("./schemas/attributes.schemas").AttributesDocument>;
    findAll({ page, perPage }: Paginator): Promise<PaginatorSchematicsInterface>;
    findOne(id: string): Promise<import("./schemas/attributes.schemas").AttributesDocument>;
    update(id: string, updateAttributeDto: UpdateAttributeDto): Promise<import("./schemas/attributes.schemas").AttributesDocument>;
    remove(id: string): Promise<import("./schemas/attributes.schemas").AttributesDocument>;
}
