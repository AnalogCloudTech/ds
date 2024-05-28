import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Session, SessionDocument } from '@/onboard/schemas/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { SessionCustomerHubspot } from '@/onboard/domain/types';
import { NODE_TYPES } from '@/internal/common/types/mongodb.type';

@Injectable()
export class SessionRepository extends GenericRepository<SessionDocument> {
  constructor(
    @InjectModel(Session.name)
    protected readonly model: Model<SessionDocument>,
  ) {
    super(model);
  }

  public getSessionsToUpdateCustomerLastStepHubspot(
    filter: FilterQuery<SessionDocument>,
  ): Promise<Array<SessionCustomerHubspot>> {
    const pipeline: PipelineStage[] = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'ds__customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $unwind: {
          path: '$customer',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          currentStep: 1,
          'customer.email': 1,
          'customer.firstName': 1,
          'customer.hubspotId': 1,
        },
      },
    ];

    return this.model.aggregate<SessionCustomerHubspot>(pipeline).exec();
  }

  public onboardSalesReport(
    match: FilterQuery<SessionDocument> = {},
    skip: number,
    perPage: number,
  ) {
    return this.model
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: skip,
        },
        {
          $limit: perPage,
        },
        {
          $lookup: {
            from: 'ds__customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customerInfo',
          },
        },
        {
          $unwind: {
            path: '$customerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'ds__coaches',
            localField: 'coach',
            foreignField: '_id',
            as: 'coachInfo',
          },
        },
        {
          $unwind: {
            path: '$coachInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'ds__onboard__offers',
            localField: 'offer',
            foreignField: '_id',
            as: 'offerDetails',
          },
        },
        {
          $unwind: {
            path: '$offerDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $set: {
            temp: {
              $map: {
                input: { $objectToArray: '$paymentIntents' },
                as: 'c',
                in: '$$c.v',
              },
            },
          },
        },
        {
          $set: {
            subscriptionId: {
              $toString: {
                $first: '$temp',
              },
            },
          },
        },
        {
          $lookup: {
            from: 'ds__customers_subscriptions',
            localField: 'subscriptionId',
            foreignField: 'subscriptionId',
            as: 'customerStatus',
          },
        },
        {
          $unwind: {
            path: '$customerStatus',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'ds__customer_events',
            localField: 'customer',
            foreignField: 'customer',
            as: 'customerEvents',
          },
        },
        {
          $addFields: {
            customerEvents: {
              $first: '$customerEvents',
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            createdAt: 1,
            updatedAt: 1,
            customerInfo: {
              firstName: 1,
              lastName: 1,
              email: 1,
              stripeId: 1,
              billing: 1,
            },
            offerDetails: { title: 1, trial: 1, code: 1 },
            customerStatus: { status: 1, updatedAt: 1, subscriptionId: 1 },
            customerEvents: { event: 1 },
            marketingParameters: 1,
            salesParameters: 1,
            currentStep: 1,
            coachingSelection: 1,
            customer: 1,
            coachInfo: { name: 1, email: 1 },
          },
        },
      ])
      .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }]);
  }

  public onboardSalesReportCount(match: FilterQuery<SessionDocument> = {}) {
    return this.model.countDocuments({ ...match });
  }
}
