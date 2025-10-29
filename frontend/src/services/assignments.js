import { z } from 'zod';
import { fetchJson } from '../lib/fetcher';
import { assignments as assignmentFixtures } from '../fixtures/assignments';

const assignmentSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    course: z.string(),
    dueDate: z.string(),
    submissions: z.number(),
    totalStudents: z.number(),
    status: z.string()
  })
);

const useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';

export const getAssignments = async () => {
  if (useFixtures) {
    return assignmentSchema.parse(assignmentFixtures);
  }

  try {
    return await fetchJson('/assignments', { schema: assignmentSchema });
  } catch (error) {
    return assignmentSchema.parse(assignmentFixtures);
  }
};

export default getAssignments;
