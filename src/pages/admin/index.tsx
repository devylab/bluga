import DashboardLayout from '@admin/layout/dashboard';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';

const Index: NextPageWithLayout = () => {
  return <h1>Hello world!</h1>;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Index;
