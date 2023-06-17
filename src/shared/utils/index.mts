import { BehaviorSubject } from 'rxjs';
import { createRequire } from 'node:module';
import fs from 'fs';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import sanitizeHtml from 'sanitize-html';
import { AdminMenu, Routes } from '../interfaces/adminRoute.interface.mjs';
import { adminMenus } from '../../admin/config.mjs';
import path from 'path';
import AdmZip from 'adm-zip';
import striptags from 'striptags';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ThemeConfig } from '../interfaces/themeConfig.interface.mjs';

export class Utils {
  static renderAdminRoutes() {
    const adminRoutes = new BehaviorSubject<AdminMenu[]>(adminMenus);

    // Add/Inject new route to admin routes
    const addNewAdminRoute = function (item: AdminMenu | AdminMenu[]) {
      const newRoutes = [...adminRoutes.value];

      if (Array.isArray(item)) {
        newRoutes.concat(item.map((i) => ({ ...i, to: path.join('/', i.to) })));
      } else {
        newRoutes.push({ ...item, to: path.join('/', item.to) });
      }

      adminRoutes.next(newRoutes);
    };

    return {
      addNewAdminRoute,
      adminRoutes,
      adminMenus: adminMenus.map((menu) => ({ ...menu, to: path.join('/', menu.to) })),
    };
  }

  static getMenus(to: string, name: string, menuPath?: string, header?: string[], footer?: string[]) {
    return { to, path: menuPath, name, header, footer };
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

  static readingTime(text: string) {
    const strippedText = striptags(text);
    const wpm = 225;
    const words = strippedText.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  }

  static defaultTitle() {
    return `untitled-${Utils.uniqueId(5)}`;
  }

  static htmlSanitizer(html: string) {
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        a: ['href', 'name', 'target', 'download'],
      },
    });
  }

  static fileDirPath(meta: { url: string }) {
    const __filename = fileURLToPath(meta.url);
    const __dirname = dirname(__filename);
    return { __dirname, __filename };
  }

  static fileRequire() {
    const require = createRequire(import.meta.url);
    return require;
  }

  static removeDirectory(dir: string) {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  static unZipFile(file: Buffer, output: string) {
    return new Promise<ThemeConfig>(async (resolve, reject) => {
      const newZip = new AdmZip(file);
      const entries = newZip.getEntries();
      const entry = entries.find((e) => e.entryName.includes('config.js'));
      if (entry) {
        newZip.extractAllToAsync(output, true, false, async (err) => {
          if (err) {
            Utils.removeDirectory(output);
            reject(err);
          }

          const readConfig = await import(output + '/config.js');
          const defaultProperties = ['name', 'url', 'version', 'creator', 'preview', 'routes'];
          const defaultRoutes = ['/', '/:slug'];
          const config = readConfig.default as ThemeConfig;
          const properties = Object.keys(config);
          const propertiesExist = properties.some((property) => defaultProperties.includes(property));
          const routesExist = Array.isArray(config.routes)
            ? config.routes.some((r) => defaultRoutes.includes(r.route))
            : false;

          if (routesExist && propertiesExist) {
            resolve(config);
          } else {
            Utils.removeDirectory(output);
            reject({ message: 'not a valid template' });
          }
        });
      } else {
        reject({ message: 'not a valid template' });
      }
    });
  }

  static getSessionSecret() {
    const { __dirname } = Utils.fileDirPath(import.meta);
    return fs.readFileSync(path.join(__dirname, '..', '..', '..', 'secret_key'));
  }

  static isFileExist(file: string) {
    return fs.existsSync(file);
  }
}
