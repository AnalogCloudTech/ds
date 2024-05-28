import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import {
  PaymentStatus,
  PaymentStatusDocument,
} from '@/payments/payment_chargify/schemas/payment-status.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentStatusRepository extends GenericRepository<PaymentStatusDocument> {
  constructor(
    @InjectModel(PaymentStatus.name)
    protected readonly model: Model<PaymentStatusDocument>,
  ) {
    super(model);
  }

  findBySubscriptionIdAndProductId(
    productId: string,
    subscriptionId: string,
  ): Promise<PaymentStatusDocument | null> {
    return this.model
      .findOne({
        'transaction.subscription_id': subscriptionId,
        'transaction.product_id': productId,
        status: 'SUCCESS',
      })
      .exec();
  }
}
