import { z } from "zod";

const formSchema = z.object({
  // ... other fields
  hometown: z.object({
    province: z.string(),
    district: z.string(),
    ward: z.string(),
  }),
  // ... other fields
});