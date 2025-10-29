import { z } from 'zod';
import { fetchJson } from '../lib/fetcher';
import { courses as courseFixtures } from '../fixtures/courses';

const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  students: z.number(),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      schedule: z.string()
    })
  )
});

const useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';

export const getCourseDetail = async (id) => {
  if (useFixtures) {
    const match = courseFixtures.find((course) => course.id === id);
    if (!match) {
      throw new Error('Course not found');
    }
    return courseSchema.parse(match);
  }

  try {
    return await fetchJson(`/courses/${id}`, { schema: courseSchema });
  } catch (error) {
    const match = courseFixtures.find((course) => course.id === id);
    if (!match) {
      throw error;
    }
    return courseSchema.parse(match);
  }
};

export default getCourseDetail;
