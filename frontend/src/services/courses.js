import { fetcher } from './api';

const useMocks = (import.meta.env.VITE_USE_MOCKS ?? 'true') !== 'false';

const loadCourseSchemas = () => import('../schemas/courses');
const loadCourseFixtures = () => import('../fixtures/courses');

export const listCourses = async () => {
  const { CourseSchema } = await loadCourseSchemas();

  if (useMocks) {
    const { coursesFixture } = await loadCourseFixtures();
    return coursesFixture.map((course) => CourseSchema.parse(course));
  }

  const data = await fetcher({ url: '/courses', method: 'get' });
  return CourseSchema.array().parse(data);
};

export const getCourseById = async (courseId) => {
  const { CourseSchema } = await loadCourseSchemas();

  if (useMocks) {
    const { coursesFixture } = await loadCourseFixtures();
    const course = coursesFixture.find((item) => item.id === courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return CourseSchema.parse(course);
  }

  const data = await fetcher({ url: `/courses/${courseId}`, method: 'get' });
  return CourseSchema.parse(data);
};

export const listAssignments = async () => {
  const { AssignmentSchema } = await loadCourseSchemas();

  if (useMocks) {
    const { assignmentsFixture } = await loadCourseFixtures();
    return assignmentsFixture.map((assignment) => AssignmentSchema.parse(assignment));
  }

  const data = await fetcher({ url: '/assignments', method: 'get' });
  return AssignmentSchema.array().parse(data);
};

export const getGradebookBySection = async (sectionId) => {
  const { GradebookSchema } = await loadCourseSchemas();

  if (useMocks) {
    const { gradebookFixture } = await loadCourseFixtures();
    if (gradebookFixture.sectionId !== sectionId) {
      throw new Error('Section not found');
    }

    return GradebookSchema.parse(gradebookFixture);
  }

  const data = await fetcher({ url: `/sections/${sectionId}/gradebook`, method: 'get' });
  return GradebookSchema.parse(data);
};
