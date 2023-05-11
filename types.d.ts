import fastify from 'fastify';

interface PointOfViewRouteSpecificOptions {
  layout?: string;
}

export type PointOfViewProperty<
  K extends string = 'view',
  T extends { [key: string]: any } = { [key: string]: any },
  R = Promise<string>,
> = Record<K, (page: string, data: T, opts?: PointOfViewRouteSpecificOptions) => R>;

declare module 'fastify' {
  export interface FastifyRequest {
    user_id: string;
    auth_guard_type: 'inner' | 'api';
  }

  interface RouteSpecificOptions extends PointOfViewRouteSpecificOptions {}

  interface FastifyReply extends PointOfViewProperty<'admin' | 'themes', object, FastifyReply> {
    view: never;
  }

  interface FastifyInstance extends PointOfViewProperty<'admin' | 'themes', object, Promise<string>> {
    view: never;
  }
}
