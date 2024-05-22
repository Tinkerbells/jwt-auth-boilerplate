import z from "zod";

const envSchema = z.object({
  BACKEND_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const ENV = envSchema.parse(process.env);

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};
