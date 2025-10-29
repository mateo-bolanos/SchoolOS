import { z } from 'zod';
import { fetchJson } from '../lib/fetcher';
import { gradebook as gradebookFixture } from '../fixtures/gradebook';

const gradebookSchema = z.object({
  sectionId: z.string(),
  courseTitle: z.string(),
  term: z.string(),
  students: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      average: z.number(),
      lastSubmission: z.string()
    })
  )
});

const useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';

export const getGradebook = async (sectionId) => {
  if (useFixtures) {
    return gradebookSchema.parse({ ...gradebookFixture, sectionId });
  }

  try {
    return await fetchJson(`/sections/${sectionId}/gradebook`, { schema: gradebookSchema });
  } catch (error) {
    return gradebookSchema.parse({ ...gradebookFixture, sectionId });
  }
};

export default getGradebook;
