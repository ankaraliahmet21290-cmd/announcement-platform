import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Agent, PropertyDetail, ListingType, PropertyType, PropertyStatus } from '../types';
import {
  Building2,
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  MapPin,
  FileText,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: 'SALE' as ListingType,
    propertyType: 'RESIDENCE' as PropertyType,
    price: '',
    currency: 'TRY',
    status: 'PUBLISHED' as PropertyStatus,
    agentId: '' as string | number,

    city: 'İstanbul',
    district: '',
    neighborhood: '',
    latitude: '',
    longitude: '',

    grossArea: '',
    netArea: '',
    roomCount: '3+1',
    buildingAge: '0 (Sıfır)',
    floor: '2. Kat',
    totalFloors: '5',
    heatingType: 'Doğalgaz (Kombi)',
    deedStatus: 'Kat Mülkiyetli',
    usageStatus: 'Boş',
    facade: 'Güney',
    bathroomCount: '1',

    suitableForLoan: true,
    furnished: false,
    hasElevator: true,
    hasBalcony: true,
    hasParking: true,
    inSite: false,

    eidsReference: '',
    eidsExpiryDate: '',

    imageUrls: [] as string[],
  });

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Fetch agents & existing property (if edit)
  useEffect(() => {
    const initData = async () => {
      try {
        if (user?.role === 'SUPER_ADMIN' || user?.role === 'OFFICE_ADMIN') {
          const res = await api.get<Agent[]>('/agents');
          setAgents(res.data);
        }

        if (isEdit && id) {
          const res = await api.get<PropertyDetail>(`/properties/${id}`);
          const p = res.data;
          setFormData({
            title: p.title || '',
            description: p.description || '',
            listingType: p.listingType,
            propertyType: p.propertyType,
            price: p.price ? p.price.toString() : '',
            currency: p.currency || 'TRY',
            status: p.status,
            agentId: p.agentId ? p.agentId.toString() : '',

            city: p.city || '',
            district: p.district || '',
            neighborhood: p.neighborhood || '',
            latitude: p.latitude ? p.latitude.toString() : '',
            longitude: p.longitude ? p.longitude.toString() : '',

            grossArea: p.grossArea ? p.grossArea.toString() : '',
            netArea: p.netArea ? p.netArea.toString() : '',
            roomCount: p.roomCount || '',
            buildingAge: p.buildingAge || '',
            floor: p.floor || '',
            totalFloors: p.totalFloors ? p.totalFloors.toString() : '',
            heatingType: p.heatingType || '',
            deedStatus: p.deedStatus || '',
            usageStatus: p.usageStatus || '',
            facade: p.facade || '',
            bathroomCount: p.bathroomCount ? p.bathroomCount.toString() : '',

            suitableForLoan: p.suitableForLoan,
            furnished: p.furnished,
            hasElevator: p.hasElevator,
            hasBalcony: p.hasBalcony,
            hasParking: p.hasParking,
            inSite: p.inSite,

            eidsReference: p.eidsReference || '',
            eidsExpiryDate: p.eidsExpiryDate || '',
            imageUrls: [],
          });
          setExistingImages(p.images || []);
        }
      } catch (err: any) {
        setError('Veriler yüklenirken hata oluştu: ' + (err.response?.data?.error || err.message));
      } finally {
        setFetching(false);
      }
    };

    initData();
  }, [id, isEdit, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!isEdit) {
      // Create mode: Create a dummy local preview or direct data
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, uploadEvent.target!.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // Edit mode: Upload to backend directly
    const uploadData = new FormData();
    uploadData.append('file', file);
    setUploadingImage(true);
    try {
      const res = await api.post(`/properties/${id}/images`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExistingImages((prev) => [...prev, res.data]);
    } catch (err: any) {
      alert('Görsel yüklenemedi: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrlInput.trim()) return;
    if (isEdit) {
      // In edit mode we can save image URLs as well
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrlInput.trim()],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrlInput.trim()],
      }));
    }
    setNewImageUrlInput('');
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!isEdit || !id) return;
    try {
      await api.delete(`/properties/${id}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      alert('Görsel silinemedi: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteNewImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      listingType: formData.listingType,
      propertyType: formData.propertyType,
      price: parseFloat(formData.price),
      currency: formData.currency,
      status: formData.status,
      agentId: formData.agentId ? Number(formData.agentId) : null,

      city: formData.city,
      district: formData.district,
      neighborhood: formData.neighborhood,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,

      grossArea: formData.grossArea ? parseInt(formData.grossArea) : null,
      netArea: formData.netArea ? parseInt(formData.netArea) : null,
      roomCount: formData.roomCount,
      buildingAge: formData.buildingAge,
      floor: formData.floor,
      totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
      heatingType: formData.heatingType,
      deedStatus: formData.deedStatus,
      usageStatus: formData.usageStatus,
      facade: formData.facade,
      bathroomCount: formData.bathroomCount ? parseInt(formData.bathroomCount) : null,

      suitableForLoan: formData.suitableForLoan,
      furnished: formData.furnished,
      hasElevator: formData.hasElevator,
      hasBalcony: formData.hasBalcony,
      hasParking: formData.hasParking,
      inSite: formData.inSite,

      eidsReference: formData.eidsReference || null,
      eidsExpiryDate: formData.eidsExpiryDate || null,
      imageUrls: formData.imageUrls,
    };

    try {
      if (isEdit) {
        await api.put(`/properties/${id}`, payload);
        setSuccess('İlan başarıyla güncellendi!');
      } else {
        const res = await api.post('/properties', payload);
        setSuccess('Yeni ilan başarıyla oluşturuldu!');
        setTimeout(() => {
          navigate(`/properties/${res.data.id}/edit`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'İlan kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/properties"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
            </h2>
            <p className="text-xs text-slate-500">Tüm alanları doldurarak ilanı yayına veya taslağa alabilirsiniz.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-600/25 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-700 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Temel Bilgiler */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-800">1. Genel İlan Bilgileri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">İlan Başlığı *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Örn: Caddebostan Sahilde Sıfır Lüks 3+1 Daire"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">İşlem Tipi *</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-semibold"
              >
                <option value="SALE">Satılık</option>
                <option value="RENT">Kiralık</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Emlak Tipi *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-semibold"
              >
                <option value="RESIDENCE">Konut (Daire/Villa)</option>
                <option value="OFFICE">İşyeri (Ofis/Plaza/Dükkan)</option>
                <option value="LAND">Arsa / Arazi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Yayın Durumu *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-semibold"
              >
                <option value="PUBLISHED">Yayında</option>
                <option value="DRAFT">Taslak</option>
                <option value="PASSIVE">Pasif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Fiyat *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="1"
                placeholder="Örn: 8500000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Para Birimi</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              >
                <option value="TRY">TRY (₺)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            {user?.role !== 'AGENT' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Sorumlu Danışman</label>
                <select
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
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

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Açıklama Metni *</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="İlan hakkında detaylı açıklama, bina özellikleri, lokasyon avantajları..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SECTION 2: Konum Bilgileri */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-800">2. Konum Bilgileri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">İl *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="İstanbul"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">İlçe *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                placeholder="Kadıköy"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mahalle</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Caddebostan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Enlem (Latitude)</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Örn: 40.9634"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Boylam (Longitude)</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Örn: 29.0571"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Alan ve Yapı Özellikleri */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-800">3. Alan ve Yapı Özellikleri</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Brüt m²</label>
              <input
                type="number"
                name="grossArea"
                value={formData.grossArea}
                onChange={handleChange}
                placeholder="145"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Net m²</label>
              <input
                type="number"
                name="netArea"
                value={formData.netArea}
                onChange={handleChange}
                placeholder="125"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Oda Sayısı</label>
              <input
                type="text"
                name="roomCount"
                value={formData.roomCount}
                onChange={handleChange}
                placeholder="3+1"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Bina Yaşı</label>
              <input
                type="text"
                name="buildingAge"
                value={formData.buildingAge}
                onChange={handleChange}
                placeholder="0 (Sıfır)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Bulunduğu Kat</label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="3. Kat"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Toplam Kat</label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleChange}
                placeholder="6"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Isıtma Tipi</label>
              <input
                type="text"
                name="heatingType"
                value={formData.heatingType}
                onChange={handleChange}
                placeholder="Doğalgaz (Kombi)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Banyo Sayısı</label>
              <input
                type="number"
                name="bathroomCount"
                value={formData.bathroomCount}
                onChange={handleChange}
                placeholder="2"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Checkbox Grid */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Ek Donanımlar</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'suitableForLoan', label: 'Krediye Uygun' },
                { name: 'furnished', label: 'Eşyalı' },
                { name: 'hasElevator', label: 'Asansör' },
                { name: 'hasBalcony', label: 'Balkon' },
                { name: 'hasParking', label: 'Otopark' },
                { name: 'inSite', label: 'Site İçerisinde' },
              ].map((item) => (
                <label key={item.name} className="flex items-center space-x-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={(formData as any)[item.name]}
                    onChange={handleChange}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: EİDS Bilgileri */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-800">4. EİDS (Elektronik İlan Doğrulama) Bilgileri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">EİDS Referans No (Opsiyonel)</label>
              <input
                type="text"
                name="eidsReference"
                value={formData.eidsReference}
                onChange={handleChange}
                placeholder="Örn: EIDS-2024-TK-001"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">EİDS Yetki Bitiş Tarihi</label>
              <input
                type="date"
                name="eidsExpiryDate"
                value={formData.eidsExpiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Görseller */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <ImageIcon className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-base text-slate-800">5. İlan Fotoğrafları</h3>
          </div>

          {/* Upload Box */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="flex-1 w-full border-2 border-dashed border-slate-300 hover:border-sky-500 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-sky-50/50 transition-colors">
              <Upload className="w-8 h-8 text-sky-600 mb-2" />
              <span className="text-sm font-bold text-slate-800">Fotoğraf Yükle</span>
              <span className="text-xs text-slate-500 mt-0.5">JPG, PNG formatında dosya seçin</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>

            <div className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-700">URL ile Fotoğraf Ekle</label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={newImageUrlInput}
                  onChange={(e) => setNewImageUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Existing & Added Images Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
            {/* Existing images from backend */}
            {existingImages.map((img, idx) => (
              <div key={img.id || idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteExistingImage(img.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded-md">
                    Kapak Görseli
                  </span>
                )}
              </div>
            ))}

            {/* Newly added URL images in create mode */}
            {formData.imageUrls.map((url, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteNewImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Link
            to="/properties"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-8 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-600/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
