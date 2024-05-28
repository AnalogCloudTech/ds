import { z } from 'zod';

export const createUpsellSchema = z
  .object({
    offerId: z.string().min(1).max(255),
    paymentProvider: z.enum(['STRIPE', 'CHARGIFY', 'NONE']),
    paymentStatus: z.enum(['SUCCESS', 'ERROR', 'UNPAID']),
    channel: z.string().min(1).max(255).optional(),
    utmSource: z.string().min(1).max(255).optional(),
    utmMedium: z.string().min(1).max(255).optional(),
    utmContent: z.string().min(1).max(255).optional(),
    utmTerm: z.string().min(1).max(255).optional(),
    customerEmail: z.string().min(1).max(255),
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
  })
  .strict();

export type CreateUpsellDto = z.infer<typeof createUpsellSchema>;
