import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../pages/Error';
import DashboardPage from '../pages/Dashboard';
import AssignmentsPage from '../pages/Assignments';
import MessagesPage from '../pages/Messages';
import CourseDetailPage from '../pages/CourseDetail';
import GradebookPage from '../pages/Gradebook';

export const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'courses/:id', element: <CourseDetailPage /> },
      { path: 'sections/:id/gradebook', element: <GradebookPage /> },
      { path: 'assignments', element: <AssignmentsPage /> },
      { path: 'messages', element: <MessagesPage /> }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
