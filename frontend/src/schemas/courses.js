import { z } from 'zod';

const isoDateString = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), { message: 'Invalid date value' })
  .transform((value) => new Date(value).toISOString());

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  instructor: z.string(),
  meetingDays: z.array(z.string()),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string(),
  students: z.number(),
  sections: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      enrollment: z.number()
    })
  )
});

export const AssignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  courseId: z.string(),
  dueDate: isoDateString,
  status: z.enum(['submitted', 'draft', 'open', 'grading']),
  submissions: z.number(),
  needsReview: z.number()
});

export const GradebookSchema = z.object({
  sectionId: z.string(),
  courseTitle: z.string(),
  gradingPeriods: z.array(z.string()),
  scores: z.array(
    z.object({
      student: z.string(),
      latestSubmission: isoDateString,
      average: z.number(),
      atRisk: z.boolean()
    })
  )
});
