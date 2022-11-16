import { FastifyInstance } from 'fastify';

export class AppModule {
  constructor(private readonly app: FastifyInstance) {}

  private loadIndex() {
    this.app.get('/', async () => {
      return {
        status: 'success',
        code: 200,
        data: 'say hi',
      };
    });
  }

  private noRoute() {
    this.app.setNotFoundHandler(async () => {
      return {
        status: 'success',
        code: 404,
        data: 'not found',
      };
    });
  }

  loadRoutes() {
    this.loadIndex();
    this.noRoute();
  }

  loadPlugins() {
    // load plugins
  }
}
