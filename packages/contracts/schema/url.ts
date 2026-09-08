import { z } from "zod";

export const SearchParamsSchema = z.object({
  keyword: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  sort: z.enum(["ASC", "DESC"]).optional(),
  status: z.string().optional(),
});

export type TSearchParams = z.infer<typeof SearchParamsSchema>;
