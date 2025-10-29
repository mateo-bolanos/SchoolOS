export const coursesFixture = [
  {
    id: 'academy-101',
    title: 'Foundations of Teaching',
    description: 'Scaffold foundational pedagogy frameworks with collaborative practice.',
    instructor: 'Dr. Helena Rivera',
    meetingDays: ['Mon', 'Wed'],
    startTime: '09:00',
    endTime: '10:15',
    room: 'North Hall 204',
    students: 28,
    sections: [
      {
        id: 'academy-101-a',
        label: 'Section A',
        enrollment: 14
      },
      {
        id: 'academy-101-b',
        label: 'Section B',
        enrollment: 14
      }
    ]
  },
  {
    id: 'academy-205',
    title: 'Advanced Curriculum Design',
    description: 'Design scholar-forward curriculum maps with authentic assessments.',
    instructor: 'Prof. Amir Hassan',
    meetingDays: ['Tue', 'Thu'],
    startTime: '13:00',
    endTime: '14:20',
    room: 'Innovation Lab 1',
    students: 22,
    sections: [
      {
        id: 'academy-205-a',
        label: 'Section A',
        enrollment: 22
      }
    ]
  }
];

export const assignmentsFixture = [
  {
    id: 'assignment-1',
    title: 'Unit Diagnostic: Inquiry-Based Learning',
    courseId: 'academy-101',
    dueDate: '2024-08-30T12:00:00.000Z',
    status: 'submitted',
    submissions: 26,
    needsReview: 12
  },
  {
    id: 'assignment-2',
    title: 'Curriculum Audit Workshop',
    courseId: 'academy-205',
    dueDate: '2024-09-02T16:00:00.000Z',
    status: 'draft',
    submissions: 0,
    needsReview: 0
  },
  {
    id: 'assignment-3',
    title: 'Peer Observation Reflection',
    courseId: 'academy-101',
    dueDate: '2024-09-05T17:30:00.000Z',
    status: 'open',
    submissions: 5,
    needsReview: 0
  }
];

export const gradebookFixture = {
  sectionId: 'academy-101-a',
  courseTitle: 'Foundations of Teaching',
  gradingPeriods: ['Q1', 'Q2'],
  scores: [
    {
      student: 'Aidan Brooks',
      latestSubmission: '2024-08-21T13:00:00.000Z',
      average: 93,
      atRisk: false
    },
    {
      student: 'Lina Patel',
      latestSubmission: '2024-08-20T09:30:00.000Z',
      average: 88,
      atRisk: false
    },
    {
      student: 'Jonas Weber',
      latestSubmission: '2024-08-19T11:45:00.000Z',
      average: 71,
      atRisk: true
    }
  ]
};
