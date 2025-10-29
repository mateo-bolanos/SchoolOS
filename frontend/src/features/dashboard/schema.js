import { z } from 'zod';

export const TrendSchema = z.object({
  value: z.number(),
  direction: z.enum(['up', 'down'])
});

export const StatSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  suffix: z.string().optional(),
  helperText: z.string().optional(),
  trend: TrendSchema.optional()
});

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string().optional()
});

export const StudentInsightSchema = z.object({
  id: z.string(),
  name: z.string(),
  indicator: z.string(),
  status: z.string(),
  trend: z.enum(['up', 'down', 'stable']).optional()
});

export const HighlightSchema = z.object({
  id: z.string(),
  title: z.string(),
  metric: z.string(),
  detail: z.string().optional()
});

export const DashboardOverviewSchema = z.object({
  stats: z.array(StatSchema),
  upcomingLessons: z.array(LessonSchema),
  atRiskStudents: z.array(StudentInsightSchema),
  highlights: z.array(HighlightSchema)
});
