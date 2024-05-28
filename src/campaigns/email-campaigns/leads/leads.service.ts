import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parser } from 'json2csv';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadEntityList } from '@/campaigns/email-campaigns/leads/entities/lead.entity';
import { ImportLeadDto } from '@/campaigns/email-campaigns/leads/dto/import-lead.dto';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import {
  ImportLeadsFromFile,
  UsageFields,
} from '@/campaigns/email-campaigns/leads/domain/types';
import { each, get, isEmpty, isNull } from 'lodash';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { DateTime } from 'luxon';
import { SortableFields } from '@/internal/utils/sortable/sortable';
import { LeadsSortableFields } from '@/internal/utils/sortable/leads-sortable-fields';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomersService } from '@/customers/customers/customers.service';
import { CreateLeadFromPagesteadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead-from-pagestead.dto';
import { SchemaId } from '@/internal/types/helpers';
import { CreateUserDto } from '@/campaigns/email-campaigns/leads/dto/create-user.dto';
import { Lead as DomainLead } from '@/campaigns/email-campaigns/leads/domain/lead';
import { resolverSerializer } from '@/internal/common/interceptors/serialize.interceptor';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LeadsFiltersDTO } from '@/campaigns/email-campaigns/leads/dto/leads-filters.dto';
import { BulkDeleteDTO } from '@/campaigns/email-campaigns/leads/controller/validators/bulk-delete.validator';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name)
    private readonly leadModel: Model<LeadDocument>,
    private readonly segmentsService: SegmentsService,
    private readonly customersService: CustomersService,
  ) {}

  async findAll(user: any): Promise<LeadDocument[]> {
    const query = this.leadModel
      .find({ customerEmail: { $in: user.identities } })
      .sort({ createdAt: 1 });
    return query.exec();
  }

  async findAllLeadsByMemberEmailId(email: string): Promise<LeadDocument[]> {
    const query = this.leadModel
      .find({ customerEmail: { $eq: email } })
      .sort({ createdAt: 1 });
    return query.exec();
  }

  async findAllPaginated(
    identities: string[],
    customer: CustomerDocument,
    page: number,
    perPage: number,
    filters?: LeadsFiltersDTO,
    sort?: SortableFields<LeadsSortableFields>,
  ): Promise<PaginatorSchematicsInterface> {
    let filterEmail = null;
    if (filters?.email) {
      const emailValue = new RegExp(filters.email);
      delete filters.email;
      filterEmail = {
        $or: [
          { email: emailValue },
          { firstName: emailValue },
          { lastName: emailValue },
        ],
      };
    }
    const filter = {
      $and: [
        {
          $or: [
            { customerEmail: { $in: identities } },
            { customer: { $eq: customer._id } },
          ],
        },
        { deletedAt: { $eq: null } },
      ],
      ...filters,
    };

    if (filterEmail) {
      filter['$and'].push(filterEmail);
    }

    const total = await this.leadModel.find(filter).countDocuments().exec();
    const skip = page * perPage;
    const leads = await this.leadModel
      .find(filter)
      .skip(skip)
      .limit(perPage)
      .sort(sort)
      .exec();

    const segmentsId: Array<number> = [];
    each(leads, (item: LeadDocument) => {
      each(item.segments, (segmentId: number) => segmentsId.push(segmentId));
    });

    const dataWithSegments = await this.segmentsService.attachSegments(
      leads,
      segmentsId,
    );

    return PaginatorSchema.build(total, dataWithSegments, page, perPage);
  }

  // TODO: create index for customerId_-1 in leads collection
  async getLastCreatedLeadByCustomerId(
    customerId: SchemaId,
  ): Promise<LeadDocument> {
    return this.leadModel
      .findOne({ customer: customerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllWithSegments(user: any, customer: CustomerDocument) {
    const filters: any = {
      $or: [
        { customerEmail: { $in: user.identities } },
        { customer: { $eq: customer._id } },
      ],
    };
    const leads = await this.leadModel.find(filters).exec();
    const segmentsId: Array<number> = [];
    each(leads, (item: LeadDocument) => {
      each(item.segments, (segmentId: number) => segmentsId.push(segmentId));
    });
    const dataWithSegments = await this.segmentsService.attachSegments(
      leads,
      segmentsId,
    );

    return dataWithSegments;
  }

  async create(
    createLeadDto: CreateLeadDto,
    customer?: CustomerDocument,
  ): Promise<LeadDocument> {
    const data = { ...createLeadDto };

    if (!customer) {
      /**
       * just an attempt to find the customer
       */
      customer = await this.customersService.findByIdentities([
        createLeadDto.customerEmail,
      ]);
    }

    if (customer) {
      data['customer'] = customer;
    }

    const inheritedData = await this.fillWithInheritanceData(data.email, data);

    const createdLead = new this.leadModel(inheritedData);
    return await createdLead.save();
  }

  async findUserLead(
    customer: CustomerDocument,
    identities: [],
    id: string,
  ): Promise<LeadDocument> {
    const lead = await this.leadModel
      .findOne({
        $and: [
          { _id: { $eq: id } },
          {
            $or: [
              { customerEmail: { $in: identities } },
              { customer: { $eq: customer._id } },
            ],
          },
        ],
      })
      .exec();

    if (!lead) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    return lead;
  }

  async update(id: SchemaId, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    return this.leadModel
      .findByIdAndUpdate(id, updateLeadDto, { new: true })
      .exec();
  }

  async updateMany(
    filter: FilterQuery<LeadDocument>,
    data: UpdateQuery<LeadDocument>,
  ): Promise<Array<LeadDocument>> {
    await this.leadModel.updateMany(filter, data).exec();
    return this.leadModel.find(filter).exec();
  }

  async updateUserLead(
    customer: CustomerDocument,
    identities: [],
    id,
    updateLeadDto: UpdateLeadDto,
  ): Promise<Lead> {
    const lead = await this.findUserLead(customer, identities, id);
    const data = { ...updateLeadDto };
    data['customer'] = customer._id;

    return this.update(lead.id, data);
  }

  private async remove(id: string | SchemaId): Promise<LeadDocument> {
    return this.leadModel
      .findByIdAndUpdate(
        id,
        {
          deletedAt: DateTime.now().toJSDate(),
        },
        { new: true },
      )
      .exec();
  }

  private async removeBulk(ids: Array<string | SchemaId>): Promise<boolean> {
    const now = DateTime.now().toJSDate();
    const result = await this.leadModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: now },
    );
    return result.acknowledged;
  }

  async removeUserLead(
    customer: CustomerDocument,
    identities: [],
    id: string,
  ): Promise<boolean> {
    const lead = await this.findUserLead(customer, identities, id);
    const duplicated = await this.findCustomerDuplicatedLeads(
      customer,
      lead.email,
      identities,
    );

    return this.removeBulk(duplicated.map((item) => item._id));
  }

  async deleteAll(customer: CustomerDocument) {
    const result = await this.leadModel.updateMany(
      {
        $and: [
          {
            $or: [
              {
                customer: { $eq: customer._id },
              },
              {
                customerEmail: { $eq: customer.email },
              },
            ],
          },
          {
            $or: [
              {
                deletedAt: { $eq: null },
              },
              {
                deleteAt: { $exists: false },
              },
            ],
          },
        ],
      },
      {
        deletedAt: DateTime.now().toJSDate(),
      },
    );
    return result.modifiedCount;
  }

  async bulkRemoveCustomerLeads(
    customer: CustomerDocument,
    dto: BulkDeleteDTO,
  ): Promise<boolean | number> {
    if (dto?.deleteAll) {
      return this.deleteAll(customer);
    }
    // TODO: this should return the number of deleted elements instead of boolean
    const results = await Promise.all(
      dto?.ids.map((id) => this.removeUserLead(customer, [], id)),
    );
    return results.some((value) => value);
  }

  async batchStoreFromFile(dto: ImportLeadDto, customer: CustomerDocument) {
    const leadsList = new LeadEntityList();
    const validList = new LeadEntityList();
    const invalidList = new LeadEntityList();
    const duplicated = new LeadEntityList();
    leadsList.setFile(dto.file);
    await leadsList.readFile();

    leadsList.setAll('segments', dto.segments);
    leadsList.setAll('customerEmail', dto.customerEmail);
    leadsList.setAll('bookId', dto.bookId);
    leadsList.setAll('allSegments', dto.allSegments === 'true');
    leadsList.setAll('customer', customer._id);
    for (const item of leadsList.list) {
      const validation = await item.validate();
      if (!validation.length) {
        const filter: FilterQuery<LeadDocument> = {
          $and: [
            { email: { $eq: item.email } },
            {
              $or: [
                { customerEmail: { $eq: dto.customerEmail } },
                { customer: { $eq: customer._id } },
              ],
            },
          ],
        };
        const duplicatedRecord = await this.leadModel.findOne(filter).exec();
        if (duplicatedRecord) {
          duplicated.push(item);
          continue;
        }
        validList.push(item);
      } else {
        invalidList.push(item);
      }
    }
    await this.leadModel.insertMany(validList.list);

    return <ImportLeadsFromFile>{
      successCount: validList.list.length,
      duplicatedCount: duplicated.list.length,
      invalidCount: invalidList.list.length,
      successList: <Array<DomainLead>>(
        resolverSerializer<DomainLead>(DomainLead, validList.list)
      ),
      duplicated: <Array<DomainLead>>(
        resolverSerializer<DomainLead>(DomainLead, duplicated.list)
      ),
      invalidList: <Array<DomainLead>>(
        resolverSerializer<DomainLead>(DomainLead, invalidList.list)
      ),
    };
  }

  async getAllFromFilter(
    filter: FilterQuery<LeadDocument>,
    lastUsageFilter: UsageFields = null,
  ): Promise<LeadDocument[]> {
    const leads = await this.leadModel.find(filter).exec();
    let pipe: LeadDocument[] = leads;
    if (lastUsageFilter) {
      pipe = this.removeTodayUsedLeads(leads, lastUsageFilter);
    }
    return this.removeDuplicatedLeads(pipe);
  }

  async unsubscribe(id: SchemaId): Promise<LeadDocument> {
    const unsub = { unsubscribed: true };
    const updated = await this.leadModel
      .findByIdAndUpdate(id, unsub, { new: true })
      .exec();

    if (updated) {
      await this.leadModel.updateMany({ email: { $eq: updated.email } }, unsub);
    }

    return updated;
  }

  async findLeadsByEmail(email: string): Promise<Array<LeadDocument>> {
    const filter = {
      email: { $eq: email },
    };
    return this.leadModel.find(filter).exec();
  }

  async removeSegmentFromLeads(segmentId: number): Promise<any> {
    const leads = await this.leadModel
      .find({ segments: { $eq: segmentId } })
      .exec();

    if (!get(leads, 'length')) {
      return;
    }

    const promises = leads.map((lead) => {
      const segmentsId = lead.segments;
      const newSegments = segmentsId.filter((item) => item !== segmentId);
      return this.leadModel.findByIdAndUpdate(
        lead._id,
        {
          segments: newSegments,
        },
        { new: true },
      );
    });

    return Promise.all(promises);
  }

  public setLeadsUsage(leads: Array<Lead>, field: UsageFields) {
    const promises: Promise<any>[] = [];
    for (const lead of leads) {
      const { email } = lead;
      const lastUsage = {
        ...lead.lastUsage,
      };
      lastUsage[field] = DateTime.now().toFormat('yyyy-MM-dd');

      const data = {
        lastUsage,
      };

      /**
       * @disclaimer Update many because we can have duplicated leads
       */
      promises.push(
        this.leadModel.updateMany({ email }, data, { new: true }).exec(),
      );
    }

    return Promise.all(promises);
  }

  async exportLeads(user: CreateUserDto, customer: CustomerDocument) {
    let leads = await this.findAllWithSegments(user, customer);
    leads = leads.map((lead) => {
      return {
        ...lead,
        segmentString: lead?.allSegments
          ? 'All segments'
          : lead.segments.map((segment) => segment.name).join(', '),
        address1: lead?.address?.address1,
        address2: lead?.address?.address2,
      };
    });

    const fields = [
      { label: 'First Name', value: 'firstName' },
      { label: 'Last Name', value: 'lastName' },
      { label: 'Email', value: 'email' },
      { label: 'Member Email', value: 'customerEmail' },
      { label: 'Segments', value: 'segmentString' },
      { label: 'Phone number', value: 'phone' },
      { label: 'Date', value: 'createdAt' },
      { label: 'Address1', value: 'address1' },
      { label: 'Address2', value: 'address2' },
    ];
    const json2csv = new Parser({ fields });
    return json2csv.parse(leads);
  }

  async getLeadCountByEmail(
    startDate: string,
    endDate: string,
    email: string,
    customer: CustomerDocument,
  ) {
    const filters: any = {
      $and: [
        {
          createdAt: {
            $gte: DateTime.fromISO(startDate).startOf('day'),
            $lt: DateTime.fromISO(endDate).endOf('day'),
          },
        },
        {
          $or: [
            { customerEmail: { $eq: email } },
            { customer: { $eq: customer._id } },
          ],
        },
      ],
    };
    return this.leadModel.find(filters).countDocuments().exec();
  }

  async fillWithInheritanceData(
    email,
    dto: CreateLeadDto | CreateLeadFromPagesteadDto,
  ): Promise<CreateLeadDto | CreateLeadFromPagesteadDto> {
    const existentBouncedLeadQuery: FilterQuery<LeadDocument> = {
      $and: [
        { email: { $eq: email } },
        {
          $or: [{ isValid: { $eq: false } }, { unsubscribed: { $eq: true } }],
        },
      ],
    };
    const existentBouncedLead = await this.leadModel
      .findOne(existentBouncedLeadQuery)
      .exec();

    if (existentBouncedLead) {
      dto['isValid'] = get(existentBouncedLead, 'isValid', false);
      dto['unsubscribed'] = get(existentBouncedLead, 'unsubscribed', true);
    }

    return dto;
  }

  public async createFromPagestead(
    dto: CreateLeadFromPagesteadDto,
  ): Promise<LeadDocument> {
    const errors = await validate(
      plainToInstance(CreateLeadFromPagesteadDto, dto),
    );

    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];

    requiredFields.forEach((field) => {
      if (isEmpty(dto[field]) || isNull(dto[field])) {
        dto[field] = field;
      }
    });

    if (errors.length) {
      dto = {
        ...dto,
        isValid: false,
      };
    }
    return this.create(dto);
  }

  public find(filter: FilterQuery<LeadDocument>) {
    return this.leadModel.find(filter).exec();
  }

  public async findCustomerDuplicatedLeads(
    customer: CustomerDocument,
    email: string,
    identities: Array<string> = [],
  ) {
    const filter = {
      $and: [
        {
          $or: [
            { customerEmail: { $in: identities } },
            { customer: { $eq: customer._id } },
          ],
        },
        { email: { $eq: email } },
      ],
    };

    return this.find(filter);
  }

  private removeDuplicatedLeads(leads: LeadDocument[]) {
    const emails = [];
    return leads.filter((lead) => {
      if (emails.find((email) => email === lead.email)) {
        return false;
      }
      emails.push(lead.email);
      return true;
    });
  }

  private removeTodayUsedLeads(leads: LeadDocument[], field: UsageFields) {
    const todayDateString = DateTime.now().toFormat('yyyy-MM-dd');
    return leads.filter((item) => {
      return get(item, ['lastUsage', field]) !== todayDateString;
    });
  }
}
