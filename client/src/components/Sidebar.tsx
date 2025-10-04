import { Search } from '../ui/Search.tsx';
import { Users } from './Users.tsx';

export const Sidebar = () => {
  return (
    <div
      className={`p-2 bg-light-panel dark:bg-dark-panel w-80 border border-light-panel-stroke/40 dark:border-dark-panel-stroke/40 me-4 rounded-2xl`}
    >
      <Search />
      <Users />
    </div>
  );
};
