/* eslint-disable @typescript-eslint/no-explicit-any */
export type AdminMenu = {
  id: string;
  to: string;
  name: string;
  path?: string;
  icon: any;
  sidebar: boolean;
  children?: {
    to: string;
    name: string;
    icon: any;
    path: string;
    sidebar: boolean;
    header?: string[];
    footer?: string[];
  }[];
  header?: string[];
  footer?: string[];
};

export type Routes = {
  to: string;
  path?: string;
  name: string;
  header?: string[];
  footer?: string[];
};
