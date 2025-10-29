import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Gradebook from '../pages/Gradebook';
import Assignments from '../pages/Assignments';
import ErrorPage from '../pages/Error';

export const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'dashboard',
        element: <Home />
      },
      {
        path: 'dashboard/gradebook',
        element: <Gradebook />
      },
      {
        path: 'dashboard/assignments',
        element: <Assignments />
      }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
