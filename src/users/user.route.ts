import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller';

export class UserRoute {
  private readonly userController;
  constructor(private readonly server: FastifyInstance) {
    this.userController = new UserController();
  }

  loadRoutes() {
    this.server.post('/create-user', this.userController.createUser);
  }
}
