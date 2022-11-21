import DashboardLayout from '@admin/layout/dashboard';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../../_app';

const CreateContent: NextPageWithLayout = () => {
  return <h1>Hello CreateContent!</h1>;
};

CreateContent.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateContent;
