import { NodeCache } from '@shared/database/node-cache';

export class Cache {
  private readonly nodeCache;
  private cacheType = 'internal';

  constructor() {
    this.nodeCache = new NodeCache();
  }

  async set(key: string, value: unknown) {
    if (this.cacheType === 'redis') {
      //
    } else {
      return this.nodeCache.set(key, value);
    }
  }

  async get(key: string) {
    if (this.cacheType === 'redis') {
      //
    } else {
      return this.nodeCache.get(key);
    }
  }

  async remove(key: string) {
    if (this.cacheType === 'redis') {
      //
    } else {
      return this.nodeCache.remove(key);
    }
  }

  async close() {
    if (this.cacheType === 'redis') {
      //
    } else {
      return this.nodeCache.close();
    }
  }
}

const cache = new Cache();
export default cache;
