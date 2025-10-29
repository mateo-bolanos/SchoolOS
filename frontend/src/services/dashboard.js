import { z } from 'zod';
import { fetchJson } from '../lib/fetcher';
import { dashboardSummary as dashboardFixtures } from '../fixtures/dashboard';

const dashboardSchema = z.object({
  stats: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.number(),
      delta: z.string().optional()
    })
  ),
  upcoming: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      course: z.string(),
      dueDate: z.string()
    })
  ),
  courseUpdates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      section: z.string(),
      lastActivity: z.string(),
      progress: z.number().min(0).max(1)
    })
  )
});

const useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';

export const getDashboardSummary = async () => {
  if (useFixtures) {
    return dashboardSchema.parse(dashboardFixtures);
  }

  try {
    return await fetchJson('/dashboard/summary', { schema: dashboardSchema });
  } catch (error) {
    return dashboardSchema.parse(dashboardFixtures);
  }
};

export default getDashboardSummary;
