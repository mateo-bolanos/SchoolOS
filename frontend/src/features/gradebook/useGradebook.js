import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { withMockFallback } from '../../lib/fetcher';
import { gradebookFixture } from '../../mocks/data';

const GradebookSchema = z.object({
  sectionId: z.string(),
  courseName: z.string(),
  gradingCategories: z.array(z.object({ name: z.string(), weight: z.number() })),
  students: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      average: z.number(),
      trend: z.enum(['up', 'down', 'stable']),
      missing: z.number()
    })
  )
});

const parseGradebook = (payload) => GradebookSchema.parse(payload);

export const fetchGradebook = async (sectionId) => {
  const data = await withMockFallback(`/sections/${sectionId}/gradebook`, () => gradebookFixture);
  return parseGradebook(data);
};

const useGradebook = (sectionId) => {
  return useQuery({
    queryKey: ['gradebook', sectionId],
    queryFn: () => fetchGradebook(sectionId),
    enabled: Boolean(sectionId)
  });
};

export default useGradebook;
