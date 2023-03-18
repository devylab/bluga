import { FastifyInstance } from 'fastify';
import { UserRoute } from './users/user.route';
import { ContentRoute } from './content/content.route';
import { AdminView } from './views/admin.view';
import { IndexView } from './views/index.view';
import { ThemeRoute } from './theme/theme.route';
import { SettingsRoute } from './settings/settings.route';

export class AppModule {
  private readonly userRoutes;
  private readonly contentRoutes;
  private readonly themeRoutes;
  private readonly indexView;
  private readonly adminView;
  private readonly settingsRoute;

  constructor(private readonly app: FastifyInstance) {
    this.indexView = new IndexView(this.app);
    this.adminView = new AdminView(this.app);
    this.userRoutes = new UserRoute(this.app);
    this.contentRoutes = new ContentRoute(this.app);
    this.themeRoutes = new ThemeRoute(this.app);
    this.settingsRoute = new SettingsRoute(this.app);
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
  }

  loadRoutes() {
    this.loadApi();
    this.indexView.loadIndexView();
    this.adminView.loadAdminView();
    this.noRoute();
  }

  loadPlugins() {
    // load plugins
  }
}
