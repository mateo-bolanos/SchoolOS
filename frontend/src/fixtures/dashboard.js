export const dashboardSummary = {
  stats: [
    { id: 'courses', label: 'Active Courses', value: 5, delta: '+1 vs last term' },
    { id: 'assignments', label: 'Assignments to Review', value: 12, delta: '4 due this week' },
    { id: 'students', label: 'Students Impacted', value: 128, delta: '+8 new enrollments' }
  ],
  upcoming: [
    {
      id: 'assignment-1',
      title: 'Research Methods Essay',
      course: 'ENG301 - Rhetoric & Composition',
      dueDate: '2024-08-01T15:00:00Z'
    },
    {
      id: 'assignment-2',
      title: 'Lab Safety Quiz',
      course: 'SCI205 - Applied Chemistry',
      dueDate: '2024-07-25T13:00:00Z'
    }
  ],
  courseUpdates: [
    {
      id: 'course-1',
      name: 'World History Seminar',
      section: 'Section A',
      lastActivity: '2024-07-18T16:32:00Z',
      progress: 0.82
    },
    {
      id: 'course-2',
      name: 'Advanced Calculus',
      section: 'Section B',
      lastActivity: '2024-07-19T10:15:00Z',
      progress: 0.64
    },
    {
      id: 'course-3',
      name: 'Creative Writing Workshop',
      section: 'Section C',
      lastActivity: '2024-07-17T08:45:00Z',
      progress: 0.48
    }
  ]
};

export default dashboardSummary;
