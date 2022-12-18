import { BehaviorSubject } from 'rxjs';
import { AdminMenu, adminMenus } from '@shared/constants/adminRoutes';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';

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

    return { addNewAdminRoute, adminRoutes, adminMenus };
  }

  static uniqueId(size = 10) {
    return nanoid(size);
  }

  static async hashPassword(password: string) {
    return argon2.hash(password);
  }

  static async comparePassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }
}
