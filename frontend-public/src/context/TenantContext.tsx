import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { tenantSlug } from '../api/client';
import { TenantInfo } from '../types';

interface TenantContextType {
  tenant: TenantInfo | null;
  loading: boolean;
  slug: string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await api.get<TenantInfo>('/public/tenant');
        setTenant(res.data);
      } catch (err) {
        console.error('Tenant bilgisi alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, slug: tenantSlug }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
