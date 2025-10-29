export const dashboardFixture = {
  metrics: [
    {
      id: 'attendance',
      label: 'Average Attendance',
      value: 96.2,
      unit: '%',
      delta: { value: 1.1, trend: 'up' }
    },
    {
      id: 'assignmentsDue',
      label: 'Assignments Awaiting Review',
      value: 14,
      delta: { value: 2, trend: 'down' }
    },
    {
      id: 'messages',
      label: 'Unread Messages',
      value: 8,
      delta: { value: 3, trend: 'up' }
    },
    {
      id: 'upcomingEvents',
      label: 'Upcoming Events',
      value: 5,
      delta: { value: 1, trend: 'flat' }
    }
  ],
  upcomingAssignments: [
    {
      id: 'assignment-1',
      title: 'Algebra II: Systems of Equations',
      course: 'Mathematics 201',
      dueDate: '2024-08-27T14:30:00.000Z',
      status: 'grading'
    },
    {
      id: 'assignment-2',
      title: 'Literature Circle Reflection',
      course: 'Language Arts 102',
      dueDate: '2024-08-29T16:00:00.000Z',
      status: 'submitted'
    },
    {
      id: 'assignment-3',
      title: 'Lab Report: Photosynthesis',
      course: 'Biology 110',
      dueDate: '2024-09-01T15:00:00.000Z',
      status: 'draft'
    }
  ],
  spotlightCourses: [
    {
      id: 'academy-101',
      title: 'Foundations of Teaching',
      instructor: 'Dr. Helena Rivera',
      engagement: 92
    },
    {
      id: 'academy-205',
      title: 'Advanced Curriculum Design',
      instructor: 'Prof. Amir Hassan',
      engagement: 88
    }
  ],
  recentMessages: [
    {
      id: 'msg-1',
      from: 'Counseling Team',
      subject: 'Parent conferences scheduled',
      preview: 'Conference slots are now published for the fall term... ',
      receivedAt: '2024-08-24T11:05:00.000Z'
    },
    {
      id: 'msg-2',
      from: 'Operations',
      subject: 'Fire drill reminder',
      preview: 'A campus-wide drill is scheduled for next Tuesday at 10:00 AM... ',
      receivedAt: '2024-08-23T08:40:00.000Z'
    }
  ]
};
