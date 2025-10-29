import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { withMockFallback } from '../../lib/fetcher';
import { assignmentsFixture } from '../../mocks/data';

const AssignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  course: z.string(),
  dueDate: z.string(),
  status: z.string(),
  submissions: z.number(),
  totalStudents: z.number()
});

const parseAssignments = (payload) => z.array(AssignmentSchema).parse(payload);

export const fetchAssignments = async () => {
  const data = await withMockFallback('/assignments', () => assignmentsFixture);
  return parseAssignments(data);
};

const useAssignments = () => {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments
  });
};

export default useAssignments;
