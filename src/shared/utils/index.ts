import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import { BehaviorSubject } from 'rxjs';
import { AdminRoute } from './utils.interface';

export class Utils {
  static uniqueId(size = 10) {
    return nanoid(size);
  }

  static async hashPassword(password: string) {
    return argon2.hash(password);
  }

  static async comparePassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }

  static renderAdminRoutes() {
    const routes = <AdminRoute[]>[
      {
        route: '/admin/login',
      },
      {
        route: '/admin',
      },
      {
        route: '/admin/contents/lists',
      },
      {
        route: '/admin/contents/create',
      },
    ];
    const adminRoutes = new BehaviorSubject<AdminRoute[]>(routes);

    const addNewAdminRoute = function (item: AdminRoute | AdminRoute[]) {
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
