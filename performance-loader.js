// ==========================================
// PERFORMANCE LOADER - DYNAMIC IMPORTS
// Lazy loads JavaScript modules for faster initial page load
// ==========================================

/**
 * Performance monitoring
 */
const performanceMetrics = {
  loadStart: performance.now(),
  modules: {}
};

/**
 * Dynamically import a module with performance tracking
 * @param {string} modulePath - Path to the module
 * @param {string} moduleName - Name for tracking (e.g., 'initiative')
 * @returns {Promise<any>} The imported module
 */
export async function lazyLoadModule(modulePath, moduleName = 'unknown') {
  const startTime = performance.now();

  try {
    console.log(`⏳ Loading module: ${moduleName}...`);

    const module = await import(modulePath);

    const loadTime = performance.now() - startTime;
    performanceMetrics.modules[moduleName] = loadTime;

    console.log(`✅ Module loaded: ${moduleName} (${loadTime.toFixed(2)}ms)`);

    return module;
  } catch (error) {
    console.error(`❌ Failed to load module: ${moduleName}`, error);
    throw error;
  }
}

/**
 * Lazy load with Intersection Observer
 * Loads module only when element becomes visible
 * @param {HTMLElement} element - Element to observe
 * @param {string} modulePath - Module to load
 * @param {Function} callback - Function to call with loaded module
 */
export function lazyLoadOnVisible(element, modulePath, callback) {
  if (!element) {
    console.warn('Element not found for lazy loading');
    return;
  }

  // Feature detection
  if (!('IntersectionObserver' in window)) {
    // Fallback: load immediately
    console.log('IntersectionObserver not supported, loading immediately');
    lazyLoadModule(modulePath).then(callback);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lazyLoadModule(modulePath).then(callback);
          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before element is visible
      threshold: 0.01
    }
  );

  observer.observe(element);
}

/**
 * Lazy load on user interaction
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} event - Event type ('click', 'focus', etc.)
 * @param {string} modulePath - Module to load
 * @param {Function} callback - Function to call with loaded module
 */
export function lazyLoadOnInteraction(element, event, modulePath, callback) {
  if (!element) {
    console.warn('Element not found for interaction-based lazy loading');
    return;
  }

  let loaded = false;

  const loadHandler = () => {
    if (!loaded) {
      loaded = true;
      lazyLoadModule(modulePath).then(callback);
      element.removeEventListener(event, loadHandler);
    }
  };

  element.addEventListener(event, loadHandler);
}

/**
 * Lazy load after delay (idle time)
 * Uses requestIdleCallback if available
 * @param {string} modulePath - Module to load
 * @param {Function} callback - Function to call with loaded module
 * @param {number} delay - Delay in ms (default: 2000)
 */
export function lazyLoadOnIdle(modulePath, callback, delay = 2000) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        lazyLoadModule(modulePath).then(callback);
      },
      { timeout: delay }
    );
  } else {
    // Fallback to setTimeout
    setTimeout(() => {
      lazyLoadModule(modulePath).then(callback);
    }, delay);
  }
}

/**
 * Preload module (download but don't execute)
 * @param {string} modulePath - Module to preload
 */
export function preloadModule(modulePath) {
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = modulePath;
  document.head.appendChild(link);
  console.log(`🔗 Preloading module: ${modulePath}`);
}

/**
 * Prefetch module (low-priority background load)
 * @param {string} modulePath - Module to prefetch
 */
export function prefetchModule(modulePath) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = modulePath;
  document.head.appendChild(link);
  console.log(`📡 Prefetching module: ${modulePath}`);
}

/**
 * Load critical modules immediately, defer non-critical
 * @param {Object} config - Configuration object
 * @param {Array<string>} config.critical - Critical modules to load now
 * @param {Array<string>} config.deferred - Non-critical modules to load later
 */
export async function loadModulesByPriority(config) {
  const { critical = [], deferred = [] } = config;

  // Load critical modules in parallel
  console.log('🚀 Loading critical modules...');
  const criticalPromises = critical.map((modulePath) =>
    lazyLoadModule(modulePath, modulePath)
  );

  await Promise.all(criticalPromises);
  console.log('✅ All critical modules loaded');

  // Load deferred modules on idle
  if (deferred.length > 0) {
    console.log('⏰ Scheduling deferred modules...');
    deferred.forEach((modulePath, index) => {
      lazyLoadOnIdle(modulePath, () => {
        console.log(`✅ Deferred module loaded: ${modulePath}`);
      }, 1000 + index * 500); // Stagger loads
    });
  }
}

/**
 * Get performance metrics
 * @returns {Object} Performance data
 */
export function getPerformanceMetrics() {
  const totalTime = performance.now() - performanceMetrics.loadStart;

  return {
    totalTime: totalTime.toFixed(2),
    modules: performanceMetrics.modules,
    moduleCount: Object.keys(performanceMetrics.modules).length,
    averageLoadTime: Object.keys(performanceMetrics.modules).length > 0
      ? (Object.values(performanceMetrics.modules).reduce((a, b) => a + b, 0) /
         Object.keys(performanceMetrics.modules).length).toFixed(2)
      : 0
  };
}

/**
 * Log performance report to console
 */
export function logPerformanceReport() {
  const metrics = getPerformanceMetrics();

  console.group('📊 Performance Report');
  console.log(`Total Time: ${metrics.totalTime}ms`);
  console.log(`Modules Loaded: ${metrics.moduleCount}`);
  console.log(`Average Load Time: ${metrics.averageLoadTime}ms`);
  console.table(metrics.modules);
  console.groupEnd();
}

/**
 * Smart module loader - automatically detects best loading strategy
 * @param {Object} config - Configuration
 */
export function initSmartLoader(config = {}) {
  const {
    modulesConfig = {},
    enableMetrics = true,
    enablePrefetch = true
  } = config;

  console.log('🧠 Smart Loader initialized');

  // Load modules based on configuration
  Object.entries(modulesConfig).forEach(([moduleName, moduleConfig]) => {
    const { path, strategy = 'immediate', element = null, event = 'click' } = moduleConfig;

    switch (strategy) {
      case 'immediate':
        lazyLoadModule(path, moduleName);
        break;

      case 'visible':
        if (element) {
          const el = typeof element === 'string' ? document.querySelector(element) : element;
          lazyLoadOnVisible(el, path, (module) => {
            console.log(`Module ${moduleName} loaded on visibility`);
          });
        }
        break;

      case 'interaction':
        if (element) {
          const el = typeof element === 'string' ? document.querySelector(element) : element;
          lazyLoadOnInteraction(el, event, path, (module) => {
            console.log(`Module ${moduleName} loaded on ${event}`);
          });
        }
        break;

      case 'idle':
        lazyLoadOnIdle(path, (module) => {
          console.log(`Module ${moduleName} loaded on idle`);
        });
        break;

      case 'prefetch':
        if (enablePrefetch) {
          prefetchModule(path);
        }
        break;

      default:
        console.warn(`Unknown loading strategy: ${strategy}`);
    }
  });

  // Log metrics after page load
  if (enableMetrics) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        logPerformanceReport();
      }, 1000);
    });
  }
}

/**
 * Resource hints for better performance
 */
export function addResourceHints() {
  // Preconnect to external APIs
  const preconnects = [
    'https://api.open5e.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  preconnects.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // DNS prefetch for additional domains
  const dnsPrefetch = [
    'https://api.open5e.com'
  ];

  dnsPrefetch.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });

  console.log('🔗 Resource hints added');
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  window.lazyLoadModule = lazyLoadModule;
  window.lazyLoadOnVisible = lazyLoadOnVisible;
  window.lazyLoadOnInteraction = lazyLoadOnInteraction;
  window.lazyLoadOnIdle = lazyLoadOnIdle;
  window.preloadModule = preloadModule;
  window.prefetchModule = prefetchModule;
  window.loadModulesByPriority = loadModulesByPriority;
  window.getPerformanceMetrics = getPerformanceMetrics;
  window.logPerformanceReport = logPerformanceReport;
  window.initSmartLoader = initSmartLoader;
  window.addResourceHints = addResourceHints;

  // Add resource hints immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addResourceHints);
  } else {
    addResourceHints();
  }
}

export default {
  lazyLoadModule,
  lazyLoadOnVisible,
  lazyLoadOnInteraction,
  lazyLoadOnIdle,
  preloadModule,
  prefetchModule,
  loadModulesByPriority,
  getPerformanceMetrics,
  logPerformanceReport,
  initSmartLoader,
  addResourceHints
};
