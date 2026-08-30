import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { DashboardSummary } from '../types';
import {
  Building2,
  Users,
  Inbox,
  TrendingUp,
  Eye,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Building,
  UserCheck,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get<DashboardSummary>('/dashboard/summary');
        setData(res.data);
      } catch (err) {
        console.error('Dashboard verisi alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // 1. SUPER_ADMIN Dashboard
  if (user?.role === 'SUPER_ADMIN') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Platform Genel Görünümü</h2>
            <p className="text-slate-500 text-sm">Tüm emlak ofisleri, kullanıcılar ve platform geneli istatistikler.</p>
          </div>
          <Link
            to="/tenants"
            className="flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-sky-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Tenant Oluştur</span>
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kayıtlı Tenantlar</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalTenants || 0}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Aktif: {data?.activeTenants || 0}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam İlan Sayısı</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.platformTotalProperties || 0}</div>
              <div className="text-xs text-sky-600 font-medium mt-1">Tüm ofisler toplamı</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Lead (Talep)</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.platformTotalLeads || 0}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Gelen müşteri talepleri</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Danışman</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.platformTotalAgents || 0}</div>
              <div className="text-xs text-indigo-600 font-medium mt-1">Sistemdeki kullanıcılar</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tenant Overview Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Sistemdeki Tenantlar (Ofisler)</h3>
            <Link to="/tenants" className="text-xs font-semibold text-sky-600 hover:text-sky-700">Tümünü Yönet &rarr;</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Firma Adı</th>
                  <th className="px-6 py-3.5">Slug / URL</th>
                  <th className="px-6 py-3.5">İlan Sayısı</th>
                  <th className="px-6 py-3.5">Lead Sayısı</th>
                  <th className="px-6 py-3.5">Danışman</th>
                  <th className="px-6 py-3.5">Durum</th>
                  <th className="px-6 py-3.5">Paket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.tenantList?.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{t.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-sky-600">/{t.slug}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{t.totalProperties}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{t.totalLeads}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{t.totalAgents}</td>
                    <td className="px-6 py-4">
                      {t.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">AKTİF</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">ASKIDA</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-purple-700">{t.planName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. OFFICE_ADMIN Dashboard
  if (user?.role === 'OFFICE_ADMIN') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user.tenantName} — Kontrol Paneli</h2>
            <p className="text-slate-500 text-sm">Ofisinizin ilan portföyü, aktif danışmanları ve müşteri talepleri.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/properties/new"
              className="flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-sky-600/20 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni İlan Ekle</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam İlan</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalProperties || 0}</div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-emerald-600 font-semibold">{data?.publishedProperties || 0} Yayında</span> •{' '}
                <span className="text-amber-600 font-semibold">{data?.draftProperties || 0} Taslak</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Müşteri Talepleri</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalLeads || 0}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">{data?.newLeads || 0} Yeni Bekleyen</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ofis Danışmanları</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.totalAgents || 0}</div>
              <div className="text-xs text-sky-600 font-medium mt-1">Aktif ekip üyesi</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tamamlanan Talepler</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.closedLeads || 0}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">Satış/Kira Sözleşmesi</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Leads & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">Son Gelen Müşteri Talepleri</h3>
              <Link to="/leads" className="text-xs font-semibold text-sky-600 hover:text-sky-700">Tümünü Gör &rarr;</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Müşteri</th>
                    <th className="px-5 py-3">Telefon</th>
                    <th className="px-5 py-3">İlan / Tip</th>
                    <th className="px-5 py-3">Atanan</th>
                    <th className="px-5 py-3">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.recentLeads && data.recentLeads.length > 0 ? (
                    data.recentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">{lead.fullName}</td>
                        <td className="px-5 py-3.5 text-xs font-mono">{lead.phone}</td>
                        <td className="px-5 py-3.5 text-xs text-slate-700 truncate max-w-[150px]">
                          {lead.propertyTitle || (lead.requestType === 'SALE' ? 'Satılık Genel' : 'Kiralık Genel')}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600">
                          {lead.assignedAgentName || <span className="text-amber-500 font-semibold">Atanmamış</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          {lead.status === 'NEW' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[11px] font-bold">YENİ</span>
                          )}
                          {lead.status === 'CONTACTED' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[11px] font-bold">İLETİŞİMDE</span>
                          )}
                          {lead.status === 'APPOINTMENT' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[11px] font-bold">RANDEVU</span>
                          )}
                          {lead.status === 'CLOSED' && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold">KAPANDI</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                        Henüz gelen bir müşteri talebi bulunmamaktadır.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Property Types (1 col) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-3">Portföy Dağılımı</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Konut (Daire / Villa)</span>
                  <span className="text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {data?.propertiesByType?.['RESIDENCE'] || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">İşyeri (Plaza / Ofis / Dükkan)</span>
                  <span className="text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {data?.propertiesByType?.['OFFICE'] || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Arsa / Arazi</span>
                  <span className="text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {data?.propertiesByType?.['LAND'] || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ofis Public Web Sitesi</h4>
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-sky-50 hover:bg-sky-100/80 rounded-xl text-sky-800 border border-sky-200/60 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold">{user.tenantName}</div>
                  <div className="text-xs text-sky-600 font-mono">localhost:5173</div>
                </div>
                <ExternalLink className="w-4 h-4 text-sky-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. AGENT Dashboard
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hoş Geldiniz, {user?.fullName}</h2>
          <p className="text-slate-500 text-sm">Size atanan ilanlar ve takip ettiğiniz müşteri talepleri.</p>
        </div>
        <Link
          to="/properties/new"
          className="flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-sky-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni İlan Ekle</span>
        </Link>
      </div>

      {/* Agent Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Atanan İlanlarım</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.myAssignedPropertiesCount || 0}</div>
            <div className="text-xs text-sky-600 font-medium mt-1">Aktif portföyünüz</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Taleplerim</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.myAssignedLeadsCount || 0}</div>
            <div className="text-xs text-indigo-600 font-medium mt-1">Müşteri görüşmeleriniz</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Yeni Bekleyen Talepler</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{data?.myNewLeadsCount || 0}</div>
            <div className="text-xs text-red-600 font-medium mt-1">Arama bekleniyor</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Agent Recent Leads */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base">Bana Atanan Son Talepler</h3>
          <Link to="/leads" className="text-xs font-semibold text-sky-600 hover:text-sky-700">Tüm Taleplerime Git &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Müşteri</th>
                <th className="px-6 py-3.5">Telefon</th>
                <th className="px-6 py-3.5">İlgili İlan</th>
                <th className="px-6 py-3.5">Mesaj</th>
                <th className="px-6 py-3.5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.myRecentLeads && data.myRecentLeads.length > 0 ? (
                data.myRecentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-semibold text-slate-900">{lead.fullName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-sky-600">{lead.phone}</td>
                    <td className="px-6 py-4 text-xs text-slate-700">{lead.propertyTitle || 'Genel Talep'}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{lead.message || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-semibold border border-sky-200">
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    Henüz atanmış bir müşteri talebiniz bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
