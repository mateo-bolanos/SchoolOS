import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
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
      }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
