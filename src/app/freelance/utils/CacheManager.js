// Cache Manager for API responses
class CacheManager {
  constructor(defaultTTL = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  generateKey(params) {
    return JSON.stringify(params, (key, value) => {
      if (value === null || value === undefined) return undefined;
      return value;
    });
  }

  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [_, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
    };
  }
}

// Create cache instances
export const teachersCache = new CacheManager(5 * 60 * 1000); // 5 minutes for teachers list
export const teacherDetailsCache = new CacheManager(10 * 60 * 1000); // 10 minutes for teacher details

// Cleanup cache every 5 minutes
setInterval(() => {
  teachersCache.cleanup();
  teacherDetailsCache.cleanup();
}, 5 * 60 * 1000);

export default CacheManager;
