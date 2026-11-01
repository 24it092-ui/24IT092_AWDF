import NodeCache from 'node-cache';

// Standard TTL: 60 seconds as specified in Practical 9
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Supplementary Problem: Cache hit and miss metrics counters
export const cacheStats = {
  hits: 0,
  misses: 0,
};

export default cache;
