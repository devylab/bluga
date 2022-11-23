/* eslint-disable max-lines-per-function */
import DashboardLayout from '@admin/layout/dashboard';
import type { ReactElement } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { NextPageWithLayout } from '../../_app';
import { useAppTheme } from '@admin/hooks/useAppTheme';
import { Box } from '@mui/material';

export const mockDataTeam = [
  {
    id: 1,
    name: 'Jon Snow',
    email: 'jonsnow@gmail.com',
    age: 35,
    phone: '(665)121-5454',
    access: 'admin',
  },
  {
    id: 2,
    name: 'Cersei Lannister',
    email: 'cerseilannister@gmail.com',
    age: 42,
    phone: '(421)314-2288',
    access: 'manager',
  },
  {
    id: 3,
    name: 'Jaime Lannister',
    email: 'jaimelannister@gmail.com',
    age: 45,
    phone: '(422)982-6739',
    access: 'user',
  },
  {
    id: 4,
    name: 'Anya Stark',
    email: 'anyastark@gmail.com',
    age: 16,
    phone: '(921)425-6742',
    access: 'admin',
  },
  {
    id: 5,
    name: 'Daenerys Targaryen',
    email: 'daenerystargaryen@gmail.com',
    age: 31,
    phone: '(421)445-1189',
    access: 'user',
  },
  {
    id: 6,
    name: 'Ever Melisandre',
    email: 'evermelisandre@gmail.com',
    age: 150,
    phone: '(232)545-6483',
    access: 'manager',
  },
  {
    id: 7,
    name: 'Ferrara Clifford',
    email: 'ferraraclifford@gmail.com',
    age: 44,
    phone: '(543)124-0123',
    access: 'user',
  },
  {
    id: 8,
    name: 'Rossini Frances',
    email: 'rossinifrances@gmail.com',
    age: 36,
    phone: '(222)444-5555',
    access: 'user',
  },
  {
    id: 9,
    name: 'Harvey Roxie',
    email: 'harveyroxie@gmail.com',
    age: 65,
    phone: '(444)555-6239',
    access: 'admin',
  },
];

const ContentLists: NextPageWithLayout = () => {
  const theme = useAppTheme();
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'email', headerName: 'Email', flex: 1, cellClassName: 'email-column--cell' },
    {
      field: 'age',
      type: 'number',
      headerName: 'Age',
      headerAlign: 'left',
      align: 'left',
      cellClassName: 'age-column--cell',
    },
    { field: 'phone', headerName: 'Phone', flex: 1, cellClassName: 'phone-column--cell' },
    {
      field: 'access',
      headerName: 'Access',
      flex: 1,
      cellClassName: 'access-column--cell',
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            sx={{
              backgroundColor: access === 'admin' ? theme.greenAccent[600] : theme.greenAccent[700],
              borderRadius: '4px',
            }}
          >
            {access}
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        height: '75vh',
        m: '40px 0 0 0',
        '& .MuiDataGrid-root': {
          border: 'none',
        },
        '& .MuiDataGrid-cell': {
          borderBottom: 'none',
        },
        '& .name-column--cell': {
          color: theme.greenAccent[300],
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.blueAccent[700],
          borderBottom: 'none',
        },
        '& .MuiDataGrid-virtualScroller': {
          backgroundColor: theme.primary[400],
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: 'none',
          backgroundColor: theme.blueAccent[700],
        },
        '& .MuiCheckbox-root': {
          color: `${theme.greenAccent[200]} !important`,
        },
        '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
          color: `${theme.grey[100]} !important`,
        },
      }}
    >
      <DataGrid rows={mockDataTeam} columns={columns} components={{ Toolbar: GridToolbar }} />
    </Box>
  );
};

ContentLists.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ContentLists;
