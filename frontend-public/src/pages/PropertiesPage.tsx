import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { PropertySummary } from '../types';
import { Building2, MapPin, Maximize2, Bed, ArrowRight, Filter, X, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { FilterSidebar } from '../components/FilterSidebar';

const MULTI_KEYS = ['roomCounts','buildingAges','floors','totalFloors','heatingTypes','deedStatuses','usageStatuses','bathroomCounts','propertyTypes'];
const BOOL_KEYS = ['suitableForLoan','furnished','hasElevator','hasBalcony','hasParking','inSite'];

function paramsToValues(sp: URLSearchParams): Record<string, any> {
  const v: Record<string, any> = {};
  v['listingType'] = sp.get('type') || '';
  v['city'] = sp.get('city') || '';
  v['district'] = sp.get('district') || '';
  v['neighborhood'] = sp.get('neighborhood') || '';
  v['minPrice'] = sp.get('minPrice') || '';
  v['maxPrice'] = sp.get('maxPrice') || '';
  v['minArea'] = sp.get('minArea') || '';
  v['maxArea'] = sp.get('maxArea') || '';
  v['minNetArea'] = sp.get('minNetArea') || '';
  v['maxNetArea'] = sp.get('maxNetArea') || '';
  v['search'] = sp.get('search') || '';
  MULTI_KEYS.forEach(k => { v[k] = sp.getAll(k.replace('Counts','Count').replace('Types','Type').replace('Statuses','Status').replace('propertyTypes','propertyType')); });
  // fix mapping
  v['roomCounts'] = sp.getAll('roomCount');
  v['buildingAges'] = sp.getAll('buildingAge');
  v['floors'] = sp.getAll('floor');
  v['totalFloors'] = sp.getAll('totalFloor');
  v['heatingTypes'] = sp.getAll('heatingType');
  v['deedStatuses'] = sp.getAll('deedStatus');
  v['usageStatuses'] = sp.getAll('usageStatus');
  v['bathroomCounts'] = sp.getAll('bathroomCount');
  v['propertyTypes'] = sp.getAll('propertyType');
  BOOL_KEYS.forEach(k => { v[k] = sp.get(k) === 'true'; });
  return v;
}

function valuesToParams(vals: Record<string, any>, sortBy: string, sortDir: string, page: number): URLSearchParams {
  const p = new URLSearchParams();
  if (vals['listingType']) p.set('type', vals['listingType']);
  if (vals['city']) p.set('city', vals['city']);
  if (vals['district']) p.set('district', vals['district']);
  if (vals['neighborhood']) p.set('neighborhood', vals['neighborhood']);
  if (vals['minPrice']) p.set('minPrice', vals['minPrice']);
  if (vals['maxPrice']) p.set('maxPrice', vals['maxPrice']);
  if (vals['minArea']) p.set('minArea', vals['minArea']);
  if (vals['maxArea']) p.set('maxArea', vals['maxArea']);
  if (vals['minNetArea']) p.set('minNetArea', vals['minNetArea']);
  if (vals['maxNetArea']) p.set('maxNetArea', vals['maxNetArea']);
  if (vals['search']) p.set('search', vals['search']);
  (vals['propertyTypes'] || []).forEach((v: string) => p.append('propertyType', v));
  (vals['roomCounts'] || []).forEach((v: string) => p.append('roomCount', v));
  (vals['buildingAges'] || []).forEach((v: string) => p.append('buildingAge', v));
  (vals['floors'] || []).forEach((v: string) => p.append('floor', v));
  (vals['totalFloors'] || []).forEach((v: string) => p.append('totalFloor', v));
  (vals['heatingTypes'] || []).forEach((v: string) => p.append('heatingType', v));
  (vals['deedStatuses'] || []).forEach((v: string) => p.append('deedStatus', v));
  (vals['usageStatuses'] || []).forEach((v: string) => p.append('usageStatus', v));
  (vals['bathroomCounts'] || []).forEach((v: string) => p.append('bathroomCount', v));
  BOOL_KEYS.forEach(k => { if (vals[k]) p.set(k, 'true'); });
  p.set('sortBy', sortBy);
  p.set('sortDir', sortDir);
  p.set('page', String(page));
  return p;
}

function countActive(vals: Record<string, any>): number {
  let n = 0;
  const skip = ['listingType','sortBy','sortDir','page'];
  Object.entries(vals).forEach(([k, v]) => {
    if (skip.includes(k)) return;
    if (Array.isArray(v) && v.length > 0) n += v.length;
    else if (!Array.isArray(v) && v && v !== '') n++;
  });
  return n;
}

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') || 'DESC';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [localVals, setLocalVals] = useState<Record<string, any>>(() => paramsToValues(searchParams));

  useEffect(() => { setLocalVals(paramsToValues(searchParams)); }, [searchParams.toString()]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/public/properties', { params: searchParams });
        setProperties(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams.toString()]);

  const handleChange = (k: string, v: any) => setLocalVals(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    setSearchParams(valuesToParams(localVals, sortBy, sortDir, 0));
    setDrawerOpen(false);
  };

  const handleClear = () => {
    const empty: Record<string, any> = {};
    setLocalVals(empty);
    setSearchParams(new URLSearchParams());
    setDrawerOpen(false);
  };

  const updateSort = (sb: string, sd: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sortBy', sb); next.set('sortDir', sd); next.set('page', '0');
    setSearchParams(next);
  };

  const updatePage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  };

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(price) + ' ' + (currency === 'TRY' ? 'TL' : currency);

  const activeCount = countActive(localVals);
  const listingType = searchParams.get('type') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-sky-600 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /><span>Portföy Arama & Filtreleme</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {listingType === 'SALE' ? 'Satılık' : listingType === 'RENT' ? 'Kiralık' : 'Tüm'} Gayrimenkul İlanları
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="font-bold text-sky-600">{totalElements}</span> ilan eşleşti
          </p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button onClick={() => setDrawerOpen(true)} className="md:hidden flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-sky-50 text-sky-700 rounded-xl text-xs font-bold border border-sky-200">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtrele {activeCount > 0 ? `(${activeCount})` : ''}</span>
          </button>
          <select value={`${sortBy}|${sortDir}`} onChange={e => { const [sb,sd] = e.target.value.split('|'); updateSort(sb,sd); }}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="createdAt|DESC">En Yeni</option>
            <option value="price|ASC">Fiyat ↑</option>
            <option value="price|DESC">Fiyat ↓</option>
            <option value="viewCount|DESC">En Çok Görüntülenen</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-1">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-sky-600" />
                <span className="font-extrabold text-sm text-slate-900">Detaylı Filtre</span>
              </div>
              {activeCount > 0 && (
                <button onClick={handleClear} className="text-[11px] text-red-500 hover:text-red-700 font-bold">Temizle</button>
              )}
            </div>
            <FilterSidebar values={localVals} onChange={handleChange} onSubmit={handleSubmit} onClear={handleClear} />
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">İlan Bulunamadı</h3>
              <p className="text-xs text-slate-500">Filtre kriterlerinizi genişleterek tekrar deneyebilirsiniz.</p>
              <button onClick={handleClear} className="mt-2 px-4 py-2 bg-sky-50 text-sky-700 font-bold rounded-xl text-xs hover:bg-sky-100 transition-colors">
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map(prop => (
                <Link key={prop.id} to={`/ilan/${prop.id}`}
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={prop.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                      alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg">
                        {prop.listingType === 'SALE' ? 'Satılık' : 'Kiralık'}
                      </span>
                      <span className="px-2.5 py-0.5 bg-sky-600 text-white text-[10px] font-semibold rounded-lg">
                        {prop.propertyType === 'RESIDENCE' ? 'Konut' : prop.propertyType === 'OFFICE' ? 'İşyeri' : 'Arsa'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/85 backdrop-blur-sm rounded-xl text-white font-extrabold text-xs">
                      {formatPrice(prop.price, prop.currency)}
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{prop.district} / {prop.city}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">{prop.title}</h3>
                    <div className="grid grid-cols-2 gap-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      {prop.roomCount && <div className="flex items-center space-x-1"><Bed className="w-3.5 h-3.5 text-slate-400" /><span>{prop.roomCount}</span></div>}
                      {prop.grossArea && <div className="flex items-center space-x-1"><Maximize2 className="w-3.5 h-3.5 text-slate-400" /><span>{prop.grossArea} m²</span></div>}
                    </div>
                  </div>
                  <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[120px]">{prop.agentName || 'Yetkili Ofis'}</span>
                    <span className="text-sky-600 font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
                      <span>İncele</span><ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <button onClick={() => updatePage(page - 1)} disabled={page === 0}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
                <button key={i} onClick={() => updatePage(i)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${page === i ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => updatePage(page + 1)} disabled={page >= totalPages - 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end md:hidden">
          <div className="bg-white w-full max-w-xs h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Filtreler</h3>
                {activeCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold">{activeCount}</span>}
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar values={localVals} onChange={handleChange} onSubmit={handleSubmit} onClear={handleClear} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
