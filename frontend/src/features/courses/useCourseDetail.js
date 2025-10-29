import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { withMockFallback } from '../../lib/fetcher';
import { courseDetailFixture } from '../../mocks/data';

const CourseDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  term: z.string(),
  description: z.string(),
  schedule: z.array(z.object({ day: z.string(), time: z.string(), location: z.string() })),
  instructors: z.array(z.object({ id: z.string(), name: z.string(), role: z.string() })),
  announcements: z.array(z.object({ id: z.string(), title: z.string(), postedAt: z.string(), excerpt: z.string() }))
});

const parseCourseDetail = (payload) => CourseDetailSchema.parse(payload);

export const fetchCourseDetail = async (courseId) => {
  const data = await withMockFallback(`/courses/${courseId}`, () => courseDetailFixture);
  return parseCourseDetail(data);
};

const useCourseDetail = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseDetail(courseId),
    enabled: Boolean(courseId)
  });
};

export default useCourseDetail;
