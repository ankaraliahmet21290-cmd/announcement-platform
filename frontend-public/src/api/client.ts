import axios from 'axios';

const tenantSlug = import.meta.env.VITE_TENANT_SLUG || 'korkmaz';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-Slug': tenantSlug,
  },
});

export { tenantSlug };
export default api;
