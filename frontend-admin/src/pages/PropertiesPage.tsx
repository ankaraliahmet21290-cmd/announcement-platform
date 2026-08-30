import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PropertySummary, PropertyStatus } from '../types';
import {
  Building2,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Filter,
} from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params: any = { size: 50 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const res = await api.get('/properties', { params });
      setProperties(res.data.content || []);
    } catch (err) {
      console.error('İlanlar alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      await api.delete(`/properties/${deleteModalId}`);
      setDeleteModalId(null);
      fetchProperties();
    } catch (err: any) {
      alert(err.response?.data?.error || 'İlan silinirken bir hata oluştu');
    }
  };

  const handleQuickStatusChange = async (id: number, newStatus: PropertyStatus) => {
    try {
      await api.put(`/properties/${id}`, { status: newStatus });
      fetchProperties();
    } catch (err: any) {
      alert('Durum güncellenemedi: ' + (err.response?.data?.error || err.message));
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(price) + ' ' + (currency === 'TRY' ? 'TL' : currency);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">İlan Portföyü</h2>
          <p className="text-slate-500 text-sm">Ofisinizdeki tüm satılık ve kiralık gayrimenkul ilanları.</p>
        </div>
        <Link
          to="/properties/new"
          className="flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-sky-600/20 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni İlan Ekle</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {[
            { key: 'ALL', label: 'Tüm İlanlar' },
            { key: 'PUBLISHED', label: 'Yayında' },
            { key: 'DRAFT', label: 'Taslak' },
            { key: 'PASSIVE', label: 'Pasif' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Başlık veya konum ara..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Filtrele
          </button>
        </form>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">İlan Bulunamadı</h3>
            <p className="text-slate-500 text-xs mt-1">Seçili filtrelere uygun herhangi bir ilan listelenemedi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">İlan</th>
                  <th className="px-6 py-3.5">Fiyat</th>
                  <th className="px-6 py-3.5">Tip / Alan</th>
                  <th className="px-6 py-3.5">Konum</th>
                  <th className="px-6 py-3.5">Danışman</th>
                  <th className="px-6 py-3.5">Görüntülenme</th>
                  <th className="px-6 py-3.5">Durum</th>
                  <th className="px-6 py-3.5 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Cover + Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {prop.coverImage ? (
                            <img src={prop.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Building2 className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-xs">
                          <Link
                            to={`/properties/${prop.id}/edit`}
                            className="font-bold text-slate-900 hover:text-sky-600 text-sm line-clamp-1 transition-colors"
                          >
                            {prop.title}
                          </Link>
                          <div className="text-xs text-slate-400 mt-0.5">#{prop.id} • {new Date(prop.createdAt).toLocaleDateString('tr-TR')}</div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatPrice(prop.price, prop.currency)}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-600">
                        {prop.listingType === 'SALE' ? 'Satılık' : 'Kiralık'}
                      </div>
                    </td>

                    {/* Category / Area */}
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-800">
                        {prop.propertyType === 'RESIDENCE' && 'Konut'}
                        {prop.propertyType === 'OFFICE' && 'İşyeri'}
                        {prop.propertyType === 'LAND' && 'Arsa'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {prop.roomCount ? `${prop.roomCount} • ` : ''}{prop.grossArea ? `${prop.grossArea} m²` : '-'}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-xs text-slate-700">
                      <div className="font-semibold">{prop.district} / {prop.city}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-[120px]">{prop.neighborhood || '-'}</div>
                    </td>

                    {/* Agent */}
                    <td className="px-6 py-4 text-xs text-slate-700">
                      {prop.agentName || <span className="text-slate-400 italic">Atanmamış</span>}
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prop.viewCount}</span>
                      </div>
                    </td>

                    {/* Status Dropdown/Badge */}
                    <td className="px-6 py-4">
                      <select
                        value={prop.status}
                        onChange={(e) => handleQuickStatusChange(prop.id, e.target.value as PropertyStatus)}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                          prop.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : prop.status === 'DRAFT'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="PUBLISHED">YAYINDA</option>
                        <option value="DRAFT">TASLAK</option>
                        <option value="PASSIVE">PASİF</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <a
                          href={`http://localhost:5173/ilan/${prop.id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Sitede Önizle"
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/properties/${prop.id}/edit`}
                          title="Düzenle"
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {(user?.role === 'SUPER_ADMIN' || user?.role === 'OFFICE_ADMIN') && (
                          <button
                            onClick={() => setDeleteModalId(prop.id)}
                            title="Sil"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">İlanı Silmek İstiyor musunuz?</h3>
            <p className="text-center text-xs text-slate-500 mt-2">
              Bu işlem geri alınamaz. İlan ve ilana ait tüm fotoğraflar veritabanından kalıcı olarak silinecektir.
            </p>
            <div className="flex items-center space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
