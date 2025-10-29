export const dashboardOverviewFixture = {
  stats: [
    {
      id: 'students',
      label: 'Active Students',
      value: 1284,
      trend: { value: 3.2, direction: 'up' },
      helperText: 'vs last week'
    },
    {
      id: 'attendance',
      label: 'Avg. Attendance',
      value: 96,
      suffix: '%',
      trend: { value: 1.1, direction: 'up' },
      helperText: 'consistent attendance'
    },
    {
      id: 'assignments',
      label: 'Assignments Due',
      value: 18,
      trend: { value: 4, direction: 'down' },
      helperText: 'next 7 days'
    },
    {
      id: 'messages',
      label: 'Unread Messages',
      value: 7,
      trend: { value: 2, direction: 'up' },
      helperText: 'parent communications'
    }
  ],
  upcomingLessons: [
    {
      id: 'lesson-1',
      title: 'Biology 201 · Cell Structures',
      startTime: '2024-09-02T13:30:00Z',
      endTime: '2024-09-02T14:20:00Z',
      room: 'Lab 3A'
    },
    {
      id: 'lesson-2',
      title: 'Chemistry 101 · Ionic Bonds',
      startTime: '2024-09-02T15:00:00Z',
      endTime: '2024-09-02T15:45:00Z',
      room: 'Room 210'
    }
  ],
  atRiskStudents: [
    {
      id: 'student-1',
      name: 'Aisha Patel',
      indicator: 'Low participation',
      status: 'Monitor',
      trend: 'down'
    },
    {
      id: 'student-2',
      name: 'Miguel Hernández',
      indicator: 'Missing assignments',
      status: 'Reach out',
      trend: 'down'
    }
  ],
  highlights: [
    {
      id: 'highlight-1',
      title: 'Grade Distribution',
      metric: 'B+',
      detail: 'Across 5 active courses'
    },
    {
      id: 'highlight-2',
      title: 'Feedback Turnaround',
      metric: '26h',
      detail: 'Average response time'
    }
  ]
};
