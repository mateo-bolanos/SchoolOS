import { fetcher } from './api';

const useMocks = (import.meta.env.VITE_USE_MOCKS ?? 'true') !== 'false';

const loadDashboardSchemas = () => import('../schemas/dashboard');
const loadDashboardFixture = () => import('../fixtures/dashboard');

export const listMessages = async () => {
  const { DashboardMessageSchema } = await loadDashboardSchemas();

  if (useMocks) {
    const { dashboardFixture } = await loadDashboardFixture();
    return dashboardFixture.recentMessages.map((message) => DashboardMessageSchema.parse(message));
  }

  const data = await fetcher({ url: '/messages', method: 'get' });
  return DashboardMessageSchema.array().parse(data);
};
