import { Injectable } from '@nestjs/common';
import { HubspotSyncActionsRepository } from '@/legacy/dis/legacy/hubspot/repository/hubspot-sync-actions.repository';
import {
  ACTIONS,
  AddCreditsData,
  AssociateDealData,
  EnrollToListData,
  SetBookPackagesData,
  STATUS,
} from '@/legacy/dis/legacy/hubspot/domain/types';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { SchemaId } from '@/internal/types/helpers';
import { UpdateQuery } from 'mongoose';
import { HubspotSyncActionsDocument } from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
import { CreateHubspotSyncActionsDTO } from '@/legacy/dis/legacy/hubspot/dto/create-hubspot-sync-actions.dto';
import { join, split, union } from 'lodash';
import { AccountType } from '@/onboard/domain/types';

@Injectable()
export class HubspotSyncActionsServices {
  constructor(
    private readonly hubspotSyncActionsRepository: HubspotSyncActionsRepository,
    private readonly hubspotService: HubspotService,
  ) {}

  private async create(data: CreateHubspotSyncActionsDTO) {
    return this.hubspotSyncActionsRepository.store(data);
  }

  async update(id: SchemaId, data: UpdateQuery<HubspotSyncActionsDocument>) {
    return this.hubspotSyncActionsRepository.update(id, data);
  }

  async associateDeal(refId: string, dealId: string) {
    const associateDealData: CreateHubspotSyncActionsDTO = {
      data: {
        dealId,
      },
      action: ACTIONS.ASSOCIATE_DEAL,
      refId,
    };

    return this.create(associateDealData);
  }

  async addBookCreditsToCustomer(refId: string, credits: number) {
    const syncCreditsData: CreateHubspotSyncActionsDTO = {
      data: {
        newCredits: credits,
      },
      action: ACTIONS.ADD_CREDITS,
      refId,
    };

    return this.create(syncCreditsData);
  }

  async enrollContactToList(refId: string, listId: number) {
    const enrollContactToList: CreateHubspotSyncActionsDTO = {
      data: {
        listId,
      },
      action: ACTIONS.ENROLL_CONTACT_TO_LIST,
      refId,
    };

    return this.create(enrollContactToList);
  }

  async setBookPackages(refId: string, bookPackages: Array<string>) {
    const setBookPackagesData: CreateHubspotSyncActionsDTO = {
      data: {
        bookPackages,
      },
      action: ACTIONS.SET_BOOK_PACKAGES,
      refId,
    };

    return this.create(setBookPackagesData);
  }

  private async handleAddCredits(
    hubspotSyncActionDocument: HubspotSyncActionsDocument,
  ): Promise<void> {
    const hubspotContact = await this.hubspotService.getContactDetailsByEmail(
      hubspotSyncActionDocument.refId,
    );

    if (!hubspotContact) {
      await this.update(hubspotSyncActionDocument._id, {
        $push: { syncResult: 'Contact not found' },
        $inc: { attempts: 1 },
        status: STATUS.PENDING,
      });

      return;
    }
    const accountType =
      hubspotContact.properties?.account_type?.value ?? AccountType.REALTOR;
    const creditsPropertyName =
      accountType === AccountType.DENTIST
        ? 'dentist_guide_credits'
        : 'afy_book_credits';
    const { newCredits } = <AddCreditsData>hubspotSyncActionDocument.data;
    const totalCredits =
      Number(hubspotContact.properties?.[creditsPropertyName]?.value ?? 0) +
      newCredits;
    await this.hubspotService.updateContactById(hubspotContact.vid.toString(), {
      properties: {
        [creditsPropertyName]: totalCredits.toString(),
      },
    });

    await this.update(hubspotSyncActionDocument._id, {
      $inc: { attempts: 1 },
      status: STATUS.COMPLETED,
    });
  }

  private async handleEnrollContactToList(
    hubspotSyncActionDocument: HubspotSyncActionsDocument,
  ): Promise<void> {
    const hubspotContact = await this.hubspotService.getContactDetailsByEmail(
      hubspotSyncActionDocument.refId,
    );

    if (!hubspotContact) {
      await this.update(hubspotSyncActionDocument._id, {
        $push: { syncResult: 'Contact not found' },
        $inc: { attempts: 1 },
        status: STATUS.PENDING,
      });

      return;
    }

    const { listId } = <EnrollToListData>hubspotSyncActionDocument.data;

    await this.hubspotService.enrollContactsToList(listId, [
      hubspotSyncActionDocument.refId,
    ]);

    await this.update(hubspotSyncActionDocument._id, {
      $inc: { attempts: 1 },
      status: STATUS.COMPLETED,
    });
  }

  private async handleSetBookPackages(
    hubspotSyncActionDocument: HubspotSyncActionsDocument,
  ): Promise<void> {
    const hubspotContact = await this.hubspotService.getContactDetailsByEmail(
      hubspotSyncActionDocument.refId,
    );

    if (!hubspotContact) {
      await this.update(hubspotSyncActionDocument._id, {
        $push: { syncResult: 'Contact not found' },
        $inc: { attempts: 1 },
        status: STATUS.PENDING,
      });

      return;
    }

    const { bookPackages } = <SetBookPackagesData>(
      hubspotSyncActionDocument.data
    );

    const oldPackages = split(
      hubspotContact.properties?.afy_package?.value ?? '',
      ';',
    ).filter(Boolean);

    const packages = union(oldPackages, bookPackages);

    await this.hubspotService.updateContactById(hubspotContact.vid.toString(), {
      properties: {
        afy_package: join(packages, ';'),
      },
    });

    await this.update(hubspotSyncActionDocument._id, {
      $inc: { attempts: 1 },
      status: STATUS.COMPLETED,
    });
  }

  private async handleAssociateDeal(
    hubspotSyncActionDocument: HubspotSyncActionsDocument,
  ): Promise<void> {
    const { dealId } = <AssociateDealData>hubspotSyncActionDocument.data;
    const refId = hubspotSyncActionDocument.refId;
    const contactId = await this.hubspotService.getContactId(refId);

    await this.hubspotService.associateDealToContact(contactId, dealId);

    await this.update(hubspotSyncActionDocument._id, {
      $inc: { attempts: 1 },
      status: STATUS.COMPLETED,
    });
  }

  async handleSyncEvent(hubspotSyncActionDocument: HubspotSyncActionsDocument) {
    await this.update(hubspotSyncActionDocument._id, {
      status: STATUS.PROCESSING,
    });

    switch (hubspotSyncActionDocument.action) {
      case ACTIONS.ADD_CREDITS:
        return await this.handleAddCredits(hubspotSyncActionDocument);
      case ACTIONS.ENROLL_CONTACT_TO_LIST:
        return await this.handleEnrollContactToList(hubspotSyncActionDocument);
      case ACTIONS.SET_BOOK_PACKAGES:
        return await this.handleSetBookPackages(hubspotSyncActionDocument);
      case ACTIONS.ASSOCIATE_DEAL:
        return await this.handleAssociateDeal(hubspotSyncActionDocument);
      default:
        return null;
    }
  }
}
