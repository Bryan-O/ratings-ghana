import { z } from "zod";
import { CATEGORIES, REGIONS, REPORT_REASONS } from "@/lib/constants";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const reviewSchema = z.object({
  businessId: z.string().min(1),
  rating: z.coerce.number({ error: "Choose a star rating" }).int("Choose a star rating").min(1, "Choose a star rating").max(5, "Choose a star rating"),
  title: z.string().trim().min(3, "Give your review a title").max(100),
  body: z
    .string()
    .trim()
    .min(30, "Tell people a bit more — at least 30 characters")
    .max(3000),
});

export const reportSchema = z.object({
  reviewId: z.string().min(1),
  reason: z.enum(REPORT_REASONS),
});

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const businessSchema = z
  .object({
    name: z.string().trim().min(2, "Enter the business name").max(100),
    type: z.enum(["PHYSICAL", "ONLINE"]),
    category: z.enum(CATEGORIES, { error: "Choose a category" }),
    description: z.string().trim().min(20, "Describe the business in at least 20 characters").max(2000),
    address: optionalText(200),
    city: optionalText(80),
    region: z
      .union([z.enum(REGIONS), z.literal("")])
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
    website: optionalText(200).pipe(
      z.string().url("Enter a full URL, e.g. https://example.com").optional(),
    ),
    phone: optionalText(30),
  })
  .superRefine((b, ctx) => {
    if (b.type === "PHYSICAL" && !b.address) {
      ctx.addIssue({ code: "custom", path: ["address"], message: "Physical businesses need an address" });
    }
    if (b.type === "PHYSICAL" && !b.city) {
      ctx.addIssue({ code: "custom", path: ["city"], message: "Enter the town or city" });
    }
    if (b.type === "ONLINE" && !b.website) {
      ctx.addIssue({ code: "custom", path: ["website"], message: "Online businesses need a website or social link" });
    }
  });

export type FieldErrors = Partial<Record<string, string>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    out[key] ??= issue.message;
  }
  return out;
}

export const FEEDBACK_TYPES = ["BUG", "CONFUSING", "IDEA", "OTHER"] as const;

export const feedbackSchema = z.object({
  type: z.enum(FEEDBACK_TYPES, { error: "Choose what kind of feedback this is" }),
  message: z.string().trim().min(5, "Tell us a little more (at least 5 characters)").max(2000, "Please keep it under 2000 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(200)
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.string().email("Enter a valid email, or leave it blank").optional())
    .optional(),
  path: z
    .string()
    .max(500)
    .transform((v) => (v.startsWith("/") ? v : "/")),
  viewport: z
    .string()
    .max(20)
    .regex(/^\d{2,5}x\d{2,5}$/)
    .optional()
    .catch(undefined),
});
