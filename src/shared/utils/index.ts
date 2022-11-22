import { BehaviorSubject } from 'rxjs';
import { AdminMenu, adminMenus } from '@shared/constants/adminRoutes';

export class Utils {
  static renderAdminRoutes() {
    const adminRoutes = new BehaviorSubject<AdminMenu[]>(adminMenus);

    const addNewAdminRoute = function (item: AdminMenu | AdminMenu[]) {
      const newRoutes = [...adminRoutes.value];

      if (Array.isArray(item)) {
        newRoutes.concat(item);
      } else {
        newRoutes.push(item);
      }

      adminRoutes.next(newRoutes);
    };

    return { addNewAdminRoute, adminRoutes };
  }
}
