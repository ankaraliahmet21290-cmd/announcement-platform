import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { PropertySummary, ListingType, PropertyType } from '../types';
import {
  Search,
  Building2,
  MapPin,
  Maximize2,
  Bed,
  ArrowRight,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const listingType = searchParams.get('type') || '';
  const propertyType = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const district = searchParams.get('district') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const roomCount = searchParams.get('roomCount') || '';
  const searchWord = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') || 'DESC';
  const page = parseInt(searchParams.get('page') || '0', 10);

  // Local Form Inputs State
  const [localCity, setLocalCity] = useState(city);
  const [localDistrict, setLocalDistrict] = useState(district);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localSearch, setLocalSearch] = useState(searchWord);
  const [localRoom, setLocalRoom] = useState(roomCount);

  useEffect(() => {
    setLocalCity(city);
    setLocalDistrict(district);
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    setLocalSearch(searchWord);
    setLocalRoom(roomCount);
  }, [city, district, minPrice, maxPrice, searchWord, roomCount]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: 9,
        sortBy,
        sortDir,
      };
      if (listingType) params.listingType = listingType;
      if (propertyType) params.propertyType = propertyType;
      if (city) params.city = city;
      if (district) params.district = district;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (roomCount) params.roomCount = roomCount;
      if (searchWord) params.search = searchWord;

      const res = await api.get('/public/properties', { params });
      setProperties(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('İlanlar alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    nextParams.set('page', '0');
    setSearchParams(nextParams);
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      city: localCity,
      district: localDistrict,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
      roomCount: localRoom,
      search: localSearch,
    });
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setLocalCity('');
    setLocalDistrict('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalSearch('');
    setLocalRoom('');
    setSearchParams(new URLSearchParams());
    setMobileFilterOpen(false);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(price) + ' ' + (currency === 'TRY' ? 'TL' : currency);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {listingType === 'SALE'
              ? 'Satılık Gayrimenkul İlanları'
              : listingType === 'RENT'
              ? 'Kiralık Gayrimenkul İlanları'
              : 'Tüm Gayrimenkul Portföyü'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Toplam <span className="font-bold text-sky-600">{totalElements}</span> ilan listeleniyor.
          </p>
        </div>

        {/* Sorting & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-sky-50 text-sky-700 rounded-xl text-xs font-bold border border-sky-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtrele ({totalElements})</span>
          </button>

          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [sb, sd] = e.target.value.split('-');
              updateFilters({ sortBy: sb, sortDir: sd });
            }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="createdAt-DESC">En Yeni Eklenenler</option>
            <option value="price-ASC">Fiyata Göre (Önce En Düşük)</option>
            <option value="price-DESC">Fiyata Göre (Önce En Yüksek)</option>
            <option value="viewCount-DESC">En Çok İncelenenler</option>
          </select>
        </div>
      </div>

      {/* Main Grid Layout (Sidebar + Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-5 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Detaylı Filtreleme</h3>
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[11px] text-slate-400 hover:text-red-600 font-semibold transition-colors"
              >
                Temizle
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-4 text-xs">
              {/* İşlem Tipi */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  İşlem Tipi
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl font-semibold">
                  {[
                    { key: '', label: 'Tümü' },
                    { key: 'SALE', label: 'Satılık' },
                    { key: 'RENT', label: 'Kiralık' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => updateFilters({ type: t.key || null })}
                      className={`py-1.5 rounded-lg text-center transition-colors ${
                        listingType === t.key ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Emlak Tipi
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => updateFilters({ category: e.target.value || null })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="">Tüm Tipler</option>
                  <option value="RESIDENCE">Konut (Daire/Villa)</option>
                  <option value="OFFICE">İşyeri / Plaza / Dükkan</option>
                  <option value="LAND">Arsa / Arazi</option>
                </select>
              </div>

              {/* Kelime Arama */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Kelime / Başlık
                </label>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Caddebostan, Bahçeli..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* İl / İlçe */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                    İl
                  </label>
                  <input
                    type="text"
                    value={localCity}
                    onChange={(e) => setLocalCity(e.target.value)}
                    placeholder="İstanbul"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                    İlçe
                  </label>
                  <input
                    type="text"
                    value={localDistrict}
                    onChange={(e) => setLocalDistrict(e.target.value)}
                    placeholder="Kadıköy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Fiyat Aralığı */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Fiyat Aralığı (TL)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Oda Sayısı */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Oda Sayısı
                </label>
                <select
                  value={localRoom}
                  onChange={(e) => setLocalRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="">Fark Etmez</option>
                  <option value="1+1">1+1</option>
                  <option value="2+1">2+1</option>
                  <option value="3+1">3+1</option>
                  <option value="4+1">4+1</option>
                  <option value="5+1">5+1 ve üzeri</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md shadow-sky-600/20 transition-colors"
              >
                Filtreleri Uygula
              </button>
            </form>
          </div>
        </div>

        {/* Properties Cards Grid (3 cols) */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Aramanıza Uygun İlan Bulunamadı</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Filtre kriterlerinizi genişleterek veya arama kelimesini değiştirerek tekrar deneyebilirsiniz.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-3 px-4 py-2 bg-sky-50 text-sky-700 font-bold rounded-xl text-xs hover:bg-sky-100"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <Link
                  key={prop.id}
                  to={`/ilan/${prop.id}`}
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={prop.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                        <span className="px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">
                          {prop.listingType === 'SALE' ? 'Satılık' : 'Kiralık'}
                        </span>
                        <span className="px-2.5 py-0.5 bg-sky-600 text-white text-[10px] font-semibold rounded-lg">
                          {prop.propertyType === 'RESIDENCE' ? 'Konut' : prop.propertyType === 'OFFICE' ? 'İşyeri' : 'Arsa'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/85 backdrop-blur-md rounded-xl text-white font-extrabold text-xs">
                        {formatPrice(prop.price, prop.currency)}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{prop.district} / {prop.city}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
                        {prop.title}
                      </h3>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                        {prop.roomCount && (
                          <div className="flex items-center space-x-1">
                            <Bed className="w-3 h-3 text-slate-400" />
                            <span>{prop.roomCount}</span>
                          </div>
                        )}
                        {prop.grossArea && (
                          <div className="flex items-center space-x-1">
                            <Maximize2 className="w-3 h-3 text-slate-400" />
                            <span>{prop.grossArea} m²</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[120px]">
                      {prop.agentName || 'Yetkili Ofis'}
                    </span>
                    <span className="text-sky-600 font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
                      <span>İncele</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => updateFilters({ page: (page - 1).toString() })}
                disabled={page === 0}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilters({ page: i.toString() })}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    page === i
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => updateFilters({ page: (page + 1).toString() })}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end md:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filtreleri Düzenle</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">İşlem Tipi</label>
                <select
                  value={listingType}
                  onChange={(e) => updateFilters({ type: e.target.value || null })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="">Tümü</option>
                  <option value="SALE">Satılık</option>
                  <option value="RENT">Kiralık</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={propertyType}
                  onChange={(e) => updateFilters({ category: e.target.value || null })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="">Tüm Tipler</option>
                  <option value="RESIDENCE">Konut</option>
                  <option value="OFFICE">İşyeri</option>
                  <option value="LAND">Arsa</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">İl</label>
                <input
                  type="text"
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                  placeholder="İstanbul"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">İlçe</label>
                <input
                  type="text"
                  value={localDistrict}
                  onChange={(e) => setLocalDistrict(e.target.value)}
                  placeholder="Kadıköy"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold"
                >
                  Temizle
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 text-white rounded-xl font-bold"
                >
                  Uygula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
