import { z } from "zod";

export const provider = z.object({
  name: z.string(),
  id: z.string(),
  icon: z.string(),
});

export type provider = z.infer<typeof provider>;
