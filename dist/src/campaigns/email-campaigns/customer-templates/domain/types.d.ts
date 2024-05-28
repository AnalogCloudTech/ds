import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import mongoose from 'mongoose';
export type CustomerType = mongoose.Types.ObjectId | CustomerDocument;
