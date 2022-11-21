import DashboardLayout from '@admin/layout/dashboard';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../../_app';

const ContentLists: NextPageWithLayout = () => {
  return <h1>Hello Content Lists!</h1>;
};

ContentLists.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ContentLists;
