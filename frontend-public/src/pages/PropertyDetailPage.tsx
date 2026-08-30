import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useTenant } from '../context/TenantContext';
import { PropertyDetail, PropertySummary } from '../types';
import {
  Building2,
  MapPin,
  Maximize2,
  Bed,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Eye,
  ShieldCheck,
  CheckCircle,
  Share2,
  ArrowLeft,
  Check,
  Send,
  Sparkles,
  ChevronRight,
  User,
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tenant } = useTenant();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PropertySummary[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('Bu ilan hakkında detaylı bilgi ve yer gösterme randevusu talep ediyorum.');
  const [leadSent, setLeadSent] = useState(false);
  const [leadSending, setLeadSending] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get<PropertyDetail>(`/public/properties/${id}`);
        const p = res.data;
        setProperty(p);
        setSelectedImage(p.coverImage || p.images?.[0]?.url || '');

        // Fetch similar properties
        const simRes = await api.get<PropertySummary[]>(`/public/properties/${id}/similar`, {
          params: { propertyType: p.propertyType, limit: 4 },
        });
        setSimilarProperties(simRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'İlan bulunamadı veya yayından kaldırılmış olabilir.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setLeadSending(true);
    try {
      await api.post('/public/leads', {
        propertyId: property.id,
        fullName: leadName,
        phone: leadPhone,
        email: leadEmail,
        message: leadMessage,
        requestType: property.listingType,
        category: property.propertyType,
        kvkkConsent: true,
      });
      setLeadSent(true);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
    } catch (err: any) {
      alert('Talebiniz iletilirken bir hata oluştu: ' + (err.response?.data?.error || err.message));
    } finally {
      setLeadSending(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('İlan bağlantısı panoya kopyalandı!');
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(price) + ' ' + (currency === 'TRY' ? 'TL' : currency);
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">İlan Görüntülenemiyor</h2>
        <p className="text-xs text-slate-500">{error || 'Bu ilan yayında değil veya silinmiş.'}</p>
        <Link
          to="/ilanlar"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl hover:bg-sky-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm İlanlara Dön</span>
        </Link>
      </div>
    );
  }

  const agentPhone = property.agentPhone || property.tenantPhone || '+90 216 345 67 89';
  const agentWhatsapp = property.agentWhatsapp || property.tenantWhatsapp || '905321112233';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-sky-600">Anasayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/ilanlar" className="hover:text-sky-600">İlanlar</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{property.title}</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-sky-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
              {property.listingType === 'SALE' ? 'Satılık' : 'Kiralık'}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
              {property.propertyType === 'RESIDENCE' ? 'Konut' : property.propertyType === 'OFFICE' ? 'İşyeri' : 'Arsa'}
            </span>
            {property.eidsReference && (
              <span className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>EİDS Doğrulanmış</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.district} / {property.city}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>İlan No: #{property.id}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.viewCount} Görüntülenme</span>
            </span>
          </div>
        </div>

        {/* Price & Share */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-left lg:text-right">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Fiyat</div>
            <div className="text-3xl font-black text-sky-600 tracking-tight">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-colors shadow-xs"
            title="İlanı Paylaş"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Detail Grid (Gallery & Content | Sidebar Agent) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Gallery, Description, Specs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery View */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-3 space-y-3">
            {/* Main Active Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            {property.images && property.images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img.url ? 'border-sky-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">İlan Açıklaması</h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {/* Detailed Specs Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">Teknik & Yapısal Özellikler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">İlan Numarası</span>
                <span className="font-bold text-slate-900 font-mono">#{property.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">İlan Tarihi</span>
                <span className="font-semibold text-slate-900">{new Date(property.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Emlak Tipi</span>
                <span className="font-semibold text-slate-900">
                  {property.propertyType === 'RESIDENCE' ? 'Konut' : property.propertyType === 'OFFICE' ? 'İşyeri' : 'Arsa'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">İşlem Tipi</span>
                <span className="font-semibold text-slate-900">{property.listingType === 'SALE' ? 'Satılık' : 'Kiralık'}</span>
              </div>
              {property.grossArea && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Brüt Alan</span>
                  <span className="font-bold text-slate-900">{property.grossArea} m²</span>
                </div>
              )}
              {property.netArea && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Net Alan</span>
                  <span className="font-bold text-slate-900">{property.netArea} m²</span>
                </div>
              )}
              {property.roomCount && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Oda Sayısı</span>
                  <span className="font-bold text-slate-900">{property.roomCount}</span>
                </div>
              )}
              {property.buildingAge && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Bina Yaşı</span>
                  <span className="font-semibold text-slate-900">{property.buildingAge}</span>
                </div>
              )}
              {property.floor && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Bulunduğu Kat</span>
                  <span className="font-semibold text-slate-900">{property.floor}</span>
                </div>
              )}
              {property.totalFloors && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Kat Sayısı</span>
                  <span className="font-semibold text-slate-900">{property.totalFloors}</span>
                </div>
              )}
              {property.heatingType && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Isıtma Tipi</span>
                  <span className="font-semibold text-slate-900">{property.heatingType}</span>
                </div>
              )}
              {property.deedStatus && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Tapu Durumu</span>
                  <span className="font-semibold text-slate-900">{property.deedStatus}</span>
                </div>
              )}
              {property.usageStatus && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Kullanım Durumu</span>
                  <span className="font-semibold text-slate-900">{property.usageStatus}</span>
                </div>
              )}
              {property.facade && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Cephe</span>
                  <span className="font-semibold text-slate-900">{property.facade}</span>
                </div>
              )}
            </div>

            {/* Extra Amenities Badges */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Ek Donanımlar & Özellikler</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Krediye Uygun', active: property.suitableForLoan },
                  { label: 'Eşyalı', active: property.furnished },
                  { label: 'Asansör', active: property.hasElevator },
                  { label: 'Balkon', active: property.hasBalcony },
                  { label: 'Otopark', active: property.hasParking },
                  { label: 'Site İçerisinde', active: property.inSite },
                ]
                  .filter((item) => item.active)
                  .map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.label}</span>
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* EİDS Verification Box */}
          {property.eidsReference && (
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-3xl p-6 text-white flex items-start space-x-4 border border-emerald-500/20 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-emerald-300">EİDS Doğrulanmış İlan</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Bu gayrimenkul ilanı, Ticaret Bakanlığı Elektronik İlan Doğrulama Sistemi (EİDS) kapsamında yetki doğrulaması yapılarak sisteme yüklenmiştir.
                </div>
                <div className="text-[11px] font-mono text-emerald-400 pt-1">
                  EİDS Referans No: {property.eidsReference}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Agent Card & Lead Contact Form */}
        <div className="space-y-6">
          {/* Agent Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Yetkili Gayrimenkul Danışmanı</div>

            <div className="flex items-center space-x-3.5 pt-1">
              <img
                src={property.agentPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
              />
              <div>
                <div className="font-bold text-slate-900 text-base">{property.agentName || tenant?.name}</div>
                <div className="text-xs text-sky-600 font-semibold">{property.tenantName}</div>
                <div className="text-[11px] text-slate-400">Sözleşmeli Portföy Yetkilisi</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`tel:${agentPhone}`}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>{agentPhone}</span>
              </a>

              <a
                href={`https://wa.me/${agentWhatsapp}?text=Merhaba,%20${encodeURIComponent(property.title)}%20(İlan%20No:%20${property.id})%20hakkında%20bilgi%20almak%20istiyorum.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp ile Yazın</span>
              </a>
            </div>
          </div>

          {/* Quick Lead Form for this Property */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Send className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-900">Bu İlan İçin Bilgi Alın</h3>
            </div>

            {leadSent ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 text-emerald-800">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Talebiniz Alındı!</div>
                <div className="text-xs text-emerald-700">Danışmanımız en kısa sürede sizi arayacaktır.</div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefon Numaranız *</label>
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    required
                    placeholder="0532..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-Posta (Opsiyonel)</label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mesajınız</label>
                  <textarea
                    rows={3}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex items-start space-x-2 pt-1 text-[11px] text-slate-500">
                  <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-sky-600" />
                  <span>KVKK kapsamında iletişim bilgilerimin işlenmesini kabul ediyorum.</span>
                </div>

                <button
                  type="submit"
                  disabled={leadSending}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/25 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{leadSending ? 'İletiliyor...' : 'Hemen Bilgi İste'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Properties Showcase */}
      {similarProperties.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Benzer İlanlar</h3>
            <p className="text-xs text-slate-500 mt-0.5">Aynı kategorideki diğer satılık/kiralık gayrimenkuller.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarProperties.map((prop) => (
              <Link
                key={prop.id}
                to={`/ilan/${prop.id}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={prop.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-slate-950/80 text-white font-bold text-[11px] rounded-lg">
                    {formatPrice(prop.price, prop.currency)}
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-[11px] text-slate-400 truncate">{prop.district} / {prop.city}</div>
                  <div className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-sky-600">
                    {prop.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
