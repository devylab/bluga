import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller';

export class UserRoute {
  private readonly userController;
  constructor(private readonly server: FastifyInstance) {
    this.userController = new UserController();
  }

  loadRoutes() {
    this.server.post('/api/user/create-user', (req, reply) => this.userController.createUser(req, reply));
    this.server.post('/api/user/login', (req, reply) => this.userController.login(req, reply));
    this.server.post('/api/user/refresh', (req, reply) => this.userController.refreshToken(req, reply));
  }
}
