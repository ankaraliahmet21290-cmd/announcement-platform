import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useTenant } from '../context/TenantContext';
import { PropertySummary, ListingType, PropertyType } from '../types';
import {
  Search,
  Building2,
  MapPin,
  Maximize2,
  Bed,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Send,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { tenant } = useTenant();
  const navigate = useNavigate();

  const [featuredProperties, setFeaturedProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Filter State
  const [listingType, setListingType] = useState<string>('SALE');
  const [propertyType, setPropertyType] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [searchWord, setSearchWord] = useState<string>('');

  // Quick Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMsg, setLeadMsg] = useState('');
  const [leadSent, setLeadSent] = useState(false);
  const [leadSending, setLeadSending] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get<PropertySummary[]>('/public/properties/featured');
        setFeaturedProperties(res.data);
      } catch (err) {
        console.error('Öne çıkan ilanlar alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.append('type', listingType);
    if (propertyType) params.append('category', propertyType);
    if (city) params.append('city', city);
    if (searchWord) params.append('search', searchWord);
    navigate(`/ilanlar?${params.toString()}`);
  };

  const handleQuickLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSending(true);
    try {
      await api.post('/public/leads', {
        fullName: leadName,
        phone: leadPhone,
        message: leadMsg || 'Anasayfa hızlı talep formundan gönderildi.',
        requestType: 'SALE',
        category: 'RESIDENCE',
        kvkkConsent: true,
      });
      setLeadSent(true);
      setLeadName('');
      setLeadPhone('');
      setLeadMsg('');
    } catch (err: any) {
      alert('Talebiniz iletilirken bir sorun oluştu: ' + (err.response?.data?.error || err.message));
    } finally {
      setLeadSending(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(price) + ' ' + (currency === 'TRY' ? 'TL' : currency);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[560px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{tenant?.name || 'Korkmaz İnşaat Emlak'} ile Hayalinizdeki Evi Keşfedin</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Doğru Yatırım, Güvenilir Gelecek & Lüks Yaşam Alanları
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Geniş gayrimenkul portföyümüz ve uzman danışman kadromuz ile ihtiyacınıza en uygun satılık ve kiralık gayrimenkulleri bulun.
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/20 max-w-4xl mx-auto text-left">
            {/* Type selector tabs */}
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-200/60">
              <button
                type="button"
                onClick={() => setListingType('SALE')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  listingType === 'SALE'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Satılık İlanlar
              </button>
              <button
                type="button"
                onClick={() => setListingType('RENT')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  listingType === 'RENT'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Kiralık İlanlar
              </button>
            </div>

            {/* Filter inputs */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Emlak Tipi
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Tüm Tipler</option>
                  <option value="RESIDENCE">Konut (Daire/Villa)</option>
                  <option value="OFFICE">İşyeri / Plaza / Dükkan</option>
                  <option value="LAND">Arsa / Arazi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Şehir / Lokasyon
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="İstanbul, Kadıköy..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Anahtar Kelime
                </label>
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Örn: Deniz Manzaralı, Sıfır..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>İlanları Bul</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-600">Vitrin</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Öne Çıkan Gayrimenkuller
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              En son eklenen ve fırsat niteliğindeki satılık/kiralık portföyümüz.
            </p>
          </div>
          <Link
            to="/ilanlar"
            className="flex items-center space-x-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100/70 px-4 py-2 rounded-xl transition-colors"
          >
            <span>Tüm İlanları İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Henüz Vitrin İlanı Yok</h3>
            <p className="text-slate-500 text-xs mt-1">İlanlar güncellenmektedir, lütfen daha sonra tekrar kontrol ediniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <Link
                key={prop.id}
                to={`/ilan/${prop.id}`}
                className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Property Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={prop.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold rounded-lg shadow-sm">
                        {prop.listingType === 'SALE' ? 'Satılık' : 'Kiralık'}
                      </span>
                      <span className="px-2.5 py-1 bg-sky-600 text-white text-[11px] font-semibold rounded-lg shadow-sm">
                        {prop.propertyType === 'RESIDENCE' ? 'Konut' : prop.propertyType === 'OFFICE' ? 'İşyeri' : 'Arsa'}
                      </span>
                    </div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-slate-950/85 backdrop-blur-md rounded-xl text-white font-extrabold text-sm shadow-md">
                      {formatPrice(prop.price, prop.currency)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{prop.neighborhood ? `${prop.neighborhood}, ` : ''}{prop.district} / {prop.city}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
                      {prop.title}
                    </h3>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      {prop.roomCount && (
                        <div className="flex items-center space-x-1.5">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.roomCount} Oda</span>
                        </div>
                      )}
                      {prop.grossArea && (
                        <div className="flex items-center space-x-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prop.grossArea} m² (Brüt)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate">
                    {prop.agentName ? `Danışman: ${prop.agentName}` : tenant?.name}
                  </span>
                  <span className="text-sky-600 font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                    <span>Detay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* WHY US / TRUST SECTION */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-600">Kurumsal Güvence</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Neden {tenant?.name || 'Bizi'} Tercih Etmelisiniz?
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Sektördeki uzun yıllara dayanan tecrübemiz ve şeffaf hizmet anlayışımızla yanınızdayız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">EİDS & Yetki Belgeli İlanlar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tüm portföyümüz resmi sözleşmeli ve EİDS (Elektronik İlan Doğrulama Sistemi) uyumlu olarak ilan edilir.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Doğru Değerleme & Hızlı Sonuç</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bölgesel piyasa analizleri ile mülkünüzün gerçek değerini tespit eder, doğru alıcılarla en hızlı sürede buluştururuz.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Kişiye Özel Yatırım Danışmanlığı</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bütçenize ve hedeflerinize uygun yüksek kira getirili ve prim potansiyeli yüksek fırsatları sizin için araştırırız.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LEAD CAPTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs font-semibold mb-4">
                <span>Ücretsiz Talep Formu</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Aradığınız Kriterlerdeki Gayrimenkulü Bulamadınız mı?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                Kriterlerinizi bize iletin; portföyümüze henüz giren veya gizli satılık/kiralık portföylerimizden sizi ilk olarak haberdar edelim.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
              {leadSent ? (
                <div className="p-6 text-center space-y-3 bg-emerald-950/60 rounded-xl border border-emerald-500/30 text-emerald-300">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                  <div className="font-bold text-base text-white">Talebiniz Başarıyla Alındı!</div>
                  <div className="text-xs">Gayrimenkul danışmanlarımız en kısa sürede sizinle iletişime geçecektir.</div>
                </div>
              ) : (
                <form onSubmit={handleQuickLeadSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      placeholder="Adınız Soyadınız *"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                      placeholder="Telefon Numaranız (05XX) *"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-mono"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={leadMsg}
                      onChange={(e) => setLeadMsg(e.target.value)}
                      placeholder="Aradığınız özellikler (Örn: Kadıköy'de 3+1 kombili daire)..."
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={leadSending}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/30 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{leadSending ? 'Gönderiliyor...' : 'Talebi İlet'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
