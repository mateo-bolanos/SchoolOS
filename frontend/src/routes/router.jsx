import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import App from '../App';
import ErrorPage from '../pages/Error';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const CourseDetail = lazy(() => import('../pages/CourseDetail'));
const Gradebook = lazy(() => import('../pages/Gradebook'));
const Assignments = lazy(() => import('../pages/Assignments'));
const Messages = lazy(() => import('../pages/Messages'));

export const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'courses/:id',
        element: <CourseDetail />
      },
      {
        path: 'sections/:id/gradebook',
        element: <Gradebook />
      },
      {
        path: 'assignments',
        element: <Assignments />
      },
      {
        path: 'messages',
        element: <Messages />
      }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
