import { fetcher } from './api';

const useMocks = (import.meta.env.VITE_USE_MOCKS ?? 'true') !== 'false';

const loadDashboardSchemas = () => import('../schemas/dashboard');
const loadDashboardFixture = () => import('../fixtures/dashboard');

export const getDashboardData = async () => {
  const { DashboardSchema } = await loadDashboardSchemas();

  if (useMocks) {
    const { dashboardFixture } = await loadDashboardFixture();
    return DashboardSchema.parse(dashboardFixture);
  }

  const data = await fetcher({ url: '/dashboard', method: 'get' });
  return DashboardSchema.parse(data);
};
