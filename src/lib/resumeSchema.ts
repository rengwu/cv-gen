import { z } from "zod";

const skillLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const linkSchema = z
  .object({
    label: z.string(),
    href: z.string(),
    icon: z.string().optional(),
  })
  .passthrough();

export const profileSchema = z
  .object({
    name: z.string(),
    caption: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    links: z.array(linkSchema),
  })
  .passthrough();

const experienceSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  location: z.string(),
  date: z.string(),
  items: z.array(z.string()),
});

const skillSchema = z.object({
  name: z.string(),
  level: skillLevelSchema,
});

const summarySchema = z.object({
  description: z.string(),
});

export const sectionSchema = z.discriminatedUnion("type", [
  z
    .object({
      title: z.string(),
      type: z.literal("experienceList"),
      data: z.array(experienceSchema),
    })
    .passthrough(),
  z
    .object({
      title: z.string(),
      type: z.literal("skillList"),
      labels: z.object({ low: z.string(), high: z.string() }),
      data: z.array(skillSchema),
    })
    .passthrough(),
  z
    .object({
      title: z.string(),
      type: z.literal("summary"),
      data: summarySchema,
    })
    .passthrough(),
]);

export const resumeDataSchema = z
  .object({
    profile: profileSchema,
    sections: z.array(sectionSchema),
  })
  .passthrough();

export const inputDataSchema = z
  .object({
    defaultLanguage: z.string().optional(),
    theme: z.string().optional(),
    languages: z.record(z.string(), resumeDataSchema),
    background: z.unknown().optional(),
  })
  .passthrough();
