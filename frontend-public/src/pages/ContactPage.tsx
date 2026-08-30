import React, { useState } from 'react';
import api from '../api/client';
import { useTenant } from '../context/TenantContext';
import { ListingType, PropertyType } from '../types';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { tenant } = useTenant();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<ListingType>('SALE');
  const [category, setCategory] = useState<PropertyType>('RESIDENCE');
  const [message, setMessage] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(true);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const phoneDisplay = tenant?.phone || '+90 216 345 67 89';
  const whatsappNumber = tenant?.whatsapp || '905321112233';
  const emailDisplay = tenant?.email || 'iletisim@korkmaz.com';
  const addressDisplay = tenant?.address || 'Bağdat Caddesi No:142 Kadıköy, İstanbul';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      await api.post('/public/leads', {
        fullName,
        phone,
        email: email || undefined,
        message,
        requestType,
        category,
        kvkkConsent,
      });
      setSent(true);
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Talebiniz kaydedilirken bir hata oluştu');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-bold rounded-full">
            İletişim
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Bizimle İletişime Geçin
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Gayrimenkul alım, satım ve kiralama talepleriniz için bize ulaşabilir veya ofisimizde kahvemizi içebilirsiniz.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info & Lead Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Col 1: Contact Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">Ofis Bilgilerimiz</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Adresimiz</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed">{addressDisplay}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Telefon</div>
                    <a href={`tel:${phoneDisplay}`} className="text-sky-600 font-mono font-semibold hover:underline mt-0.5 block">
                      {phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">E-Posta</div>
                    <a href={`mailto:${emailDisplay}`} className="text-slate-600 hover:text-sky-600 mt-0.5 block">
                      {emailDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Çalışma Saatleri</div>
                    <div className="text-slate-600 mt-0.5">Pazartesi - Cumartesi: 09:00 - 19:00</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp ile Hızlı Mesaj Gönder</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2 & 3: Contact Lead Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Müşteri Talep ve İletişim Formu</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Aradığınız gayrimenkul kriterlerini veya satmak/kiralamak istediğiniz mülkünüzü bize bildirin.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {sent ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 text-emerald-800">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-lg text-emerald-900">Talebiniz Başarıyla İletildi!</h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Uzman gayrimenkul danışmanlarımız talebinizi inceleyerek en kısa sürede telefon ile geri dönüş sağlayacaktır.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-3 px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                  >
                    Yeni Form Gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Adınız Soyadınız *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Telefon Numaranız *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="0532..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">E-Posta Adresi (Opsiyonel)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ahmet@gmail.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">İşlem Tipi</label>
                        <select
                          value={requestType}
                          onChange={(e) => setRequestType(e.target.value as ListingType)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-semibold"
                        >
                          <option value="SALE">Satılık</option>
                          <option value="RENT">Kiralık</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">Emlak Tipi</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as PropertyType)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none font-semibold"
                        >
                          <option value="RESIDENCE">Konut</option>
                          <option value="OFFICE">İşyeri</option>
                          <option value="LAND">Arsa</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1.5">Talebiniz / Mesajınız *</label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Aradığınız bütçe, lokasyon, m², oda sayısı veya mülkünüzün detaylarını yazınız..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2 text-[11px] text-slate-500">
                    <input
                      type="checkbox"
                      checked={kvkkConsent}
                      onChange={(e) => setKvkkConsent(e.target.checked)}
                      required
                      className="mt-0.5 rounded text-sky-600"
                    />
                    <span>
                      KVKK Aydınlatma Metni kapsamında kişisel verilerimin iletişim ve bilgilendirme amaçlı işlenmesini kabul ediyorum.
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{sending ? 'Talebiniz Gönderiliyor...' : 'Talebi İlet'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
