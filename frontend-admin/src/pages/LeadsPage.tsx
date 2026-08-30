import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Lead, LeadStatus, Agent } from '../types';
import {
  Inbox,
  Search,
  Phone,
  Mail,
  UserCheck,
  Building2,
  Clock,
  CheckCircle,
  FileEdit,
  MessageSquare,
  Filter,
  X,
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Edit Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>('NEW');
  const [editAgentId, setEditAgentId] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params: any = { size: 50 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const res = await api.get('/leads', { params });
      setLeads(res.data.content || []);
    } catch (err) {
      console.error('Talepler alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'OFFICE_ADMIN') {
      try {
        const res = await api.get<Agent[]>('/agents');
        setAgents(res.data);
      } catch (err) {
        console.error('Danışmanlar alınamadı:', err);
      }
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, [statusFilter]);

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditAgentId(lead.assignedAgentId ? lead.assignedAgentId.toString() : '');
    setEditNotes(lead.notes || '');
  };

  const handleSaveEdit = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      await api.patch(`/leads/${selectedLead.id}`, {
        status: editStatus,
        assignedAgentId: editAgentId ? parseInt(editAgentId) : null,
        notes: editNotes,
      });
      setSelectedLead(null);
      fetchLeads();
    } catch (err: any) {
      alert('Talep güncellenirken hata oluştu: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200">YENİ TALEP</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">İLETİŞİMDE</span>;
      case 'APPOINTMENT':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">RANDEVU VERİLDİ</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">KAPANDI (ANLAŞILDI)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Müşteri Talep (Lead) Havuzu</h2>
          <p className="text-slate-500 text-sm">Web sitesinden ve ilan sayfalarından gelen tüm müşteri talepleri.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-1 overflow-x-auto">
        {[
          { key: 'ALL', label: 'Tüm Talepler' },
          { key: 'NEW', label: 'Yeni (Bekleyen)' },
          { key: 'CONTACTED', label: 'İletişimde' },
          { key: 'APPOINTMENT', label: 'Randevu Aşamasında' },
          { key: 'CLOSED', label: 'Kapandı' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === tab.key
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Talep Bulunamadı</h3>
            <p className="text-slate-500 text-xs mt-1">Seçili filtrede henüz kayıtlı bir müşteri talebi yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Müşteri</th>
                  <th className="px-6 py-3.5">İletişim</th>
                  <th className="px-6 py-3.5">İlgili İlan / Talep Tipi</th>
                  <th className="px-6 py-3.5">Müşteri Notu / Mesajı</th>
                  <th className="px-6 py-3.5">Atanan Danışman</th>
                  <th className="px-6 py-3.5">Durum</th>
                  <th className="px-6 py-3.5">Tarih</th>
                  <th className="px-6 py-3.5 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{lead.fullName}</td>
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 font-mono text-sky-600 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                      </div>
                      {lead.email && (
                        <div className="flex items-center space-x-1.5 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-700">
                      {lead.propertyTitle ? (
                        <div className="font-semibold text-slate-800 line-clamp-1 max-w-[180px]" title={lead.propertyTitle}>
                          {lead.propertyTitle}
                        </div>
                      ) : (
                        <span className="font-semibold text-slate-500">Genel Form Talebi</span>
                      )}
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {lead.requestType === 'SALE' ? 'Satılık' : 'Kiralık'} • {lead.category}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">
                      <div className="line-clamp-2 italic" title={lead.message || ''}>
                        "{lead.message || '-'}"
                      </div>
                      {lead.notes && (
                        <div className="mt-1 text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                          Ofis Notu: {lead.notes}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs">
                      {lead.assignedAgentName ? (
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {lead.assignedAgentName}
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                          Atanmamış
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(lead.status)}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {new Date(lead.createdAt).toLocaleDateString('tr-TR')}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(lead)}
                        className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        Yönet / Ata
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Assign Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Talebi Yönet & Danışman Ata</h3>
              <button onClick={() => setSelectedLead(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-slate-900 text-sm">{selectedLead.fullName}</div>
              <div className="text-sky-600 font-mono font-semibold">{selectedLead.phone}</div>
              <div className="text-slate-500 mt-1 italic">"{selectedLead.message || 'Mesaj bırakılmadı'}"</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Talep Durumu</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                >
                  <option value="NEW">YENİ (Bekleyen)</option>
                  <option value="CONTACTED">İLETİŞİMDE (Arandı / Görüşüldü)</option>
                  <option value="APPOINTMENT">RANDEVU VERİLDİ (Yer Gösterme)</option>
                  <option value="CLOSED">KAPANDI (İşlem Tamamlandı)</option>
                </select>
              </div>

              {user?.role !== 'AGENT' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Danışman Ataması</label>
                  <select
                    value={editAgentId}
                    onChange={(e) => setEditAgentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-semibold"
                  >
                    <option value="">Atanmamış</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.fullName} ({ag.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İç Ofis Notları (Görüşme Detayları)</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Örn: Müşteri arandı, cumartesi günü saat 14:00 için yer gösterme randevusu teyit edildi."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20"
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
