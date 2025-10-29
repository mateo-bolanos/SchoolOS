import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../pages/Dashboard';
import CourseDetailPage from '../pages/CourseDetail';
import GradebookPage from '../pages/Gradebook';
import AssignmentsPage from '../pages/Assignments';
import MessagesPage from '../pages/Messages';
import ErrorPage from '../pages/Error';

export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'courses/:id',
        element: <CourseDetailPage />
      },
      {
        path: 'sections/:sectionId/gradebook',
        element: <GradebookPage />
      },
      {
        path: 'assignments',
        element: <AssignmentsPage />
      },
      {
        path: 'messages',
        element: <MessagesPage />
      }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
