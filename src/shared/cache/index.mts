import { NodeCache } from '@shared/database/node-cache.mjs';

export class Cache {
  private readonly nodeCache;
  private cacheType = 'internal';

  constructor() {
    this.nodeCache = new NodeCache();
  }

  async set(key: string, value: string) {
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
      return this.nodeCache.get(key) as string;
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
