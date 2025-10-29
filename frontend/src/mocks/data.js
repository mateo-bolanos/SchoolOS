export const courseDetailFixture = {
  id: 'intro-to-biology',
  name: 'Introduction to Biology',
  code: 'BIO-101',
  term: 'Fall 2024',
  description:
    'Explore the foundations of cellular biology with lab-based learning and collaborative projects.',
  schedule: [
    { day: 'Monday', time: '9:00 AM - 10:30 AM', location: 'Science Hall 204' },
    { day: 'Wednesday', time: '9:00 AM - 10:30 AM', location: 'Science Hall 204' }
  ],
  instructors: [
    { id: 'ins-1', name: 'Jordan Smith', role: 'Lead Instructor' },
    { id: 'ins-2', name: 'Priya Desai', role: 'Lab Assistant' }
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Lab safety refresher',
      postedAt: '2024-08-30T15:00:00Z',
      excerpt: 'Review the updated safety checklist before Monday’s lab session.'
    }
  ]
};

export const gradebookFixture = {
  sectionId: '1',
  courseName: 'Introduction to Biology',
  gradingCategories: [
    { name: 'Labs', weight: 40 },
    { name: 'Quizzes', weight: 25 },
    { name: 'Projects', weight: 35 }
  ],
  students: [
    { id: 'stu-1', name: 'Aisha Patel', average: 92, trend: 'up', missing: 0 },
    { id: 'stu-2', name: 'Miguel Hernández', average: 78, trend: 'down', missing: 2 },
    { id: 'stu-3', name: 'Noah Chen', average: 85, trend: 'stable', missing: 1 },
    { id: 'stu-4', name: 'Zara Ibrahim', average: 88, trend: 'up', missing: 0 }
  ]
};

export const assignmentsFixture = [
  {
    id: 'assign-1',
    title: 'Microscopy Lab Report',
    course: 'Biology 101',
    dueDate: '2024-09-05T23:59:00Z',
    status: 'In progress',
    submissions: 24,
    totalStudents: 28
  },
  {
    id: 'assign-2',
    title: 'Photosynthesis Quiz',
    course: 'Biology 101',
    dueDate: '2024-09-07T08:00:00Z',
    status: 'Scheduled',
    submissions: 0,
    totalStudents: 28
  },
  {
    id: 'assign-3',
    title: 'Lab Prep: Enzymes',
    course: 'Biology 201',
    dueDate: '2024-09-04T13:00:00Z',
    status: 'Needs review',
    submissions: 18,
    totalStudents: 22
  }
];

export const messagesFixture = [
  {
    id: 'msg-1',
    subject: 'Parent follow-up - Miguel',
    participants: ['Andrea Hernández'],
    lastMessageAt: '2024-09-01T21:15:00Z',
    unread: true,
    preview: 'Thank you for the update on Miguel’s progress...'
  },
  {
    id: 'msg-2',
    subject: 'Field trip permission slips',
    participants: ['Science Department'],
    lastMessageAt: '2024-09-01T18:05:00Z',
    unread: false,
    preview: 'We have collected 26 of 30 permission slips so far.'
  }
];
