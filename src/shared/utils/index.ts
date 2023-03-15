import { BehaviorSubject } from 'rxjs';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import { AdminMenu, Routes } from '@shared/interfaces/adminRoute.interface';
import { adminMenus } from '../../admin/config';

export class Utils {
  static renderAdminRoutes() {
    const adminRoutes = new BehaviorSubject<AdminMenu[]>(adminMenus);

    // Add/Inject new route to admin routes
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

  static getMenus(to: string, name: string, path?: string, header?: string[], footer?: string[]) {
    return { to, path, name, header, footer };
  }

  // eslint-disable-next-line max-lines-per-function
  static formatAdminRoutes(adminMenu: AdminMenu | AdminMenu[]) {
    let routes: Routes[] = [];

    // Check if adminMenu is an array
    if (Array.isArray(adminMenu)) {
      for (const menu of adminMenu) {
        if (menu?.children?.length) {
          const nestedMenus = menu.children.map((nestedMenu) =>
            Utils.getMenus(
              menu.to + nestedMenu.to,
              nestedMenu.name,
              nestedMenu.path,
              nestedMenu?.header,
              nestedMenu?.footer,
            ),
          );
          routes = [...routes, ...nestedMenus];
        } else {
          routes.push(Utils.getMenus(menu.to, menu.name, menu.path, menu?.header, menu?.footer));
        }
      }
    } else {
      if (adminMenu?.children?.length) {
        const nestedMenus = adminMenu.children.map((nestedMenu) =>
          Utils.getMenus(
            adminMenu.to + nestedMenu.to,
            nestedMenu.name,
            nestedMenu.path,
            nestedMenu?.header,
            nestedMenu?.footer,
          ),
        );
        routes = [...routes, ...nestedMenus];
      } else {
        routes.push({
          to: adminMenu.to,
          path: adminMenu.path,
          name: adminMenu.name,
          header: adminMenu?.header,
          footer: adminMenu?.footer,
        });
        routes.push(Utils.getMenus(adminMenu.to, adminMenu.name, adminMenu.path, adminMenu?.header, adminMenu?.footer));
      }
    }

    return routes;
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
