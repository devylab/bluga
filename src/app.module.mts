import { FastifyInstance } from 'fastify';
import { UserRoute } from './users/user.route.mjs';
import { ContentRoute } from './content/content.route.mjs';
import { AdminView } from './views/admin.view.mjs';
import { IndexView } from './views/index.view.mjs';
import { ThemeRoute } from './theme/theme.route.mjs';
import { SettingsRoute } from './settings/settings.route.mjs';
import { UploadRoute } from './upload/upload.route.mjs';
import { CategoryRoute } from './category/category.route.mjs';

export class AppModule {
  private readonly userRoutes;
  private readonly contentRoutes;
  private readonly themeRoutes;
  private readonly uploadRoutes;
  private readonly indexView;
  private readonly adminView;
  private readonly settingsRoute;
  private readonly categoryRoute;

  constructor(private readonly app: FastifyInstance) {
    this.indexView = new IndexView(this.app);
    this.adminView = new AdminView(this.app);
    this.userRoutes = new UserRoute(this.app);
    this.contentRoutes = new ContentRoute(this.app);
    this.themeRoutes = new ThemeRoute(this.app);
    this.settingsRoute = new SettingsRoute(this.app);
    this.uploadRoutes = new UploadRoute(this.app);
    this.categoryRoute = new CategoryRoute(this.app);
  }

  private noRoute() {
    this.app.setNotFoundHandler(async () => {
      // const theme = 'second' + '/index.html';
      return { data: 'nothing to show' };
    });
  }

  private loadApi() {
    this.userRoutes.loadRoutes();
    this.contentRoutes.loadRoutes();
    this.themeRoutes.loadRoutes();
    this.settingsRoute.loadRoutes();
    this.uploadRoutes.loadRoutes();
    this.categoryRoute.loadRoutes();
  }

  async loadRoutes() {
    await this.loadApi();
    await this.indexView.loadIndexView();
    await this.adminView.loadAdminView();
    await this.noRoute();
  }

  loadPlugins() {
    // load plugins
  }
}
