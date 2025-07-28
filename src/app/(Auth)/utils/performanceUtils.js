/**
 * Performance Utilities for Auth System
 */

// Debounce function for performance optimization
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Performance measurement utility
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${name} failed after ${end - start}ms:`, error);
      throw error;
    }
  };
};

// Cache utility with TTL
export class Cache {
  constructor(ttl = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Form validation performance utilities
export const createValidationCache = () => {
  const cache = new Map();

  return {
    get: (key) => cache.get(key),
    set: (key, value) => cache.set(key, value),
    clear: () => cache.clear(),
    has: (key) => cache.has(key),
  };
};

// API request optimization utilities
export const createRequestQueue = () => {
  const queue = [];
  let processing = false;

  const processQueue = async () => {
    if (processing || queue.length === 0) return;

    processing = true;
    const request = queue.shift();

    try {
      await request.fn();
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      processing = false;
      processQueue();
    }
  };

  return {
    add: (fn) => {
      queue.push({ fn });
      processQueue();
    },
    clear: () => {
      queue.length = 0;
    },
    size: () => queue.length,
  };
};

// Image loading optimization
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Event listener optimization
export const addOptimizedEventListener = (
  element,
  event,
  handler,
  options = {}
) => {
  const optimizedHandler = throttle(handler, 16); // ~60fps
  element.addEventListener(event, optimizedHandler, {
    passive: true,
    ...options,
  });

  return () => {
    element.removeEventListener(event, optimizedHandler);
  };
};

// DOM manipulation optimization
export const batchDOMUpdates = (updates) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      updates.forEach((update) => update());
      requestAnimationFrame(resolve);
    });
  });
};

// Memory management utilities
export const createMemoryManager = () => {
  const observers = new Set();

  return {
    addObserver: (observer) => observers.add(observer),
    removeObserver: (observer) => observers.delete(observer),
    cleanup: () => {
      observers.forEach((observer) => {
        if (typeof observer.cleanup === "function") {
          observer.cleanup();
        }
      });
      observers.clear();
    },
  };
};

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  startTimer(name) {
    this.metrics.set(name, performance.now());
  }

  endTimer(name) {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      this.notifyObservers(name, duration);
      return duration;
    }
    return 0;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers(name, duration) {
    this.observers.forEach((observer) => {
      if (typeof observer === "function") {
        observer(name, duration);
      }
    });
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Export default performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility for checking if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Utility for lazy loading
export const createLazyLoader = (loadFn, options = {}) => {
  const { threshold = 0.1, rootMargin = "50px" } = options;

  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            loadFn().then(resolve);
          }
        });
      },
      { threshold, rootMargin }
    );

    return observer;
  });
};

// Export all utilities
export default {
  debounce,
  throttle,
  memoize,
  measurePerformance,
  Cache,
  createValidationCache,
  createRequestQueue,
  preloadImage,
  addOptimizedEventListener,
  batchDOMUpdates,
  createMemoryManager,
  PerformanceMonitor,
  performanceMonitor,
  isInViewport,
  createLazyLoader,
};
