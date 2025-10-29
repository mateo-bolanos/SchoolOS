import { useQuery } from '@tanstack/react-query';
import { DashboardOverviewSchema } from './schema';
import { dashboardOverviewFixture } from './fixtures';
import { withMockFallback } from '../../lib/fetcher';

const DASHBOARD_QUERY_KEY = ['dashboard', 'overview'];

const parseDashboardOverview = (payload) => DashboardOverviewSchema.parse(payload);

export const fetchDashboardOverview = async () => {
  const data = await withMockFallback('/dashboard/overview', () => dashboardOverviewFixture);
  return parseDashboardOverview(data);
};

const useDashboardOverview = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboardOverview
  });
};

export default useDashboardOverview;
