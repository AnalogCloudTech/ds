import { z } from 'zod';

export const addressSchema = z.object({
  addressLine1: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  country: z.string(),
});

const frontCoverSchema = z.array(
  z.object({
    image: z.string(),
    name: z.string(),
    title: z.string(),
  }),
);

export const createGuideDetailsSchema = z.object({
  frontCover: frontCoverSchema,
  practiceName: z.string(),
  practiceAddress: addressSchema,
  practicePhone: z.string(),
  practiceLogo: z.string(),
  practiceWebsite: z.string(),
  practiceEmail: z.string(),
  shippingAddress: addressSchema,
});

export type CreateGuideDataDetailsDto = z.infer<
  typeof createGuideDetailsSchema
>;
