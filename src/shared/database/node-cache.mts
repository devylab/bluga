import nodeCache from 'node-cache';

export class NodeCache {
  private readonly cache;

  constructor() {
    this.cache = new nodeCache();
  }

  set(key: string, value: unknown) {
    // get time from config
    const ttl = 3600;
    return this.cache.set(key, value, ttl);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  remove(key: string) {
    return this.cache.del(key);
  }

  close() {
    return this.cache.close();
  }
}
