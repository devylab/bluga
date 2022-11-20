type Sidebar = {
  active: boolean;
};

const Sidebar = ({ active }: Sidebar) => {
  const sidebarClass = active ? '' : '';
  return <div className={sidebarClass}>Sidebar</div>;
};

export default Sidebar;
