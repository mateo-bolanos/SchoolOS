import { z } from 'zod';

const isoDateString = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), { message: 'Invalid date value' })
  .transform((value) => new Date(value).toISOString());

const deltaSchema = z.object({
  value: z.number(),
  trend: z.enum(['up', 'down', 'flat'])
});

const metricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  delta: deltaSchema.optional()
});

const upcomingAssignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  course: z.string(),
  dueDate: isoDateString,
  status: z.enum(['draft', 'grading', 'submitted', 'open'])
});

const spotlightCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  instructor: z.string(),
  engagement: z.number()
});

const recentMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  subject: z.string(),
  preview: z.string(),
  receivedAt: isoDateString
});

export const DashboardSchema = z.object({
  metrics: z.array(metricSchema),
  upcomingAssignments: z.array(upcomingAssignmentSchema).default([]),
  spotlightCourses: z.array(spotlightCourseSchema).default([]),
  recentMessages: z.array(recentMessageSchema).default([])
});

export const DashboardMetricSchema = metricSchema;
export const DashboardUpcomingAssignmentSchema = upcomingAssignmentSchema;
export const DashboardMessageSchema = recentMessageSchema;
