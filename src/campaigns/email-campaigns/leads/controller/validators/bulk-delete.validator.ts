import { z } from 'zod';

export const bulkDeleteValidatorSchema = z
  .object({
    deleteAll: z.boolean(),
    ids: z.string().array(),
  })
  .strict()
  .partial()
  .refine(
    ({ deleteAll, ids }) =>
      deleteAll !== undefined || (ids !== undefined && ids?.length !== 0),
    { message: 'One of the fields must be defined' },
  );

export type BulkDeleteDTO = z.infer<typeof bulkDeleteValidatorSchema>;
