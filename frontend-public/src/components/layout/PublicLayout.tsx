import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Award,
  Clock,
  Send,
} from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { tenant } = useTenant();
  const [mobileOpen, setMobileOpen] = useState(false);

  const phoneDisplay = tenant?.phone || '+90 216 345 67 89';
  const whatsappNumber = tenant?.whatsapp || '905321112233';
  const emailDisplay = tenant?.email || 'iletisim@korkmaz.com';
  const addressDisplay = tenant?.address || 'Bağdat Caddesi No:142 Kadıköy, İstanbul';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Contact Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <a href={`tel:${phoneDisplay}`} className="hover:text-white transition-colors">{phoneDisplay}</a>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <a href={`mailto:${emailDisplay}`} className="hover:text-white transition-colors">{emailDisplay}</a>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate max-w-xs">{addressDisplay}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Merhaba,%20web%20sitenizdeki%20ilanlar%20hakkında%20bilgi%20almak%20istiyorum.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Destek Hattı</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="http://localhost:5174/login"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-[11px]"
            >
              <span>Ofis Paneli</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-sky-600/20 group-hover:scale-105 transition-transform">
              {tenant?.name ? tenant.name.charAt(0) : 'T'}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg tracking-tight leading-none group-hover:text-sky-600 transition-colors">
                {tenant?.name || 'Korkmaz İnşaat Emlak'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide mt-1">
                Gayrimenkul & Yatırım Danışmanlığı
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              Anasayfa
            </NavLink>
            <NavLink
              to="/ilanlar"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              Tüm İlanlar
            </NavLink>
            <NavLink
              to="/ilanlar?type=SALE"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors"
            >
              Satılık
            </NavLink>
            <NavLink
              to="/ilanlar?type=RENT"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors"
            >
              Kiralık
            </NavLink>
            <NavLink
              to="/hakkimizda"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              Hakkımızda
            </NavLink>
            <NavLink
              to="/iletisim"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              İletişim
            </NavLink>
          </nav>

          {/* Action CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/iletisim"
              className="flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/25 hover:shadow-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ücretsiz Talep Bırak</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-sky-600 rounded-xl"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-lg">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-sky-50"
            >
              Anasayfa
            </NavLink>
            <NavLink
              to="/ilanlar"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-sky-50"
            >
              Tüm İlanlar
            </NavLink>
            <NavLink
              to="/ilanlar?type=SALE"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-sky-50"
            >
              Satılık İlanlar
            </NavLink>
            <NavLink
              to="/ilanlar?type=RENT"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-sky-50"
            >
              Kiralık İlanlar
            </NavLink>
            <NavLink
              to="/hakkimizda"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-sky-50"
            >
              Hakkımızda
            </NavLink>
            <NavLink
              to="/iletisim"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-sky-50"
            >
              İletişim
            </NavLink>
          </div>
        )}
      </header>

      {/* Main Page Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: About */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-bold text-xl text-white">
                  {tenant?.name ? tenant.name.charAt(0) : 'K'}
                </div>
                <div className="font-bold text-lg">{tenant?.name || 'Korkmaz İnşaat Emlak'}</div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {tenant?.aboutText ? (
                  tenant.aboutText.slice(0, 180) + '...'
                ) : (
                  'İstanbul ve çevresinde güvenilir gayrimenkul danışmanlığı, lüks konut ve ticari yatırım uzmanlığı.'
                )}
              </p>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Taşınmaz Ticareti Yetki Belgeli Ofis</span>
              </div>
            </div>

            {/* Col 2: Hızlı Linkler */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Hızlı Menü</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/" className="hover:text-white transition-colors">Anasayfa</Link></li>
                <li><Link to="/ilanlar" className="hover:text-white transition-colors">Tüm Portföy</Link></li>
                <li><Link to="/ilanlar?type=SALE" className="hover:text-white transition-colors">Satılık Gayrimenkuller</Link></li>
                <li><Link to="/ilanlar?type=RENT" className="hover:text-white transition-colors">Kiralık Gayrimenkuller</Link></li>
                <li><Link to="/hakkimizda" className="hover:text-white transition-colors">Kurumsal & Hakkımızda</Link></li>
                <li><Link to="/iletisim" className="hover:text-white transition-colors">Bize Ulaşın</Link></li>
              </ul>
            </div>

            {/* Col 3: Kategoriler */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Portföy Tipleri</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/ilanlar?category=RESIDENCE" className="hover:text-white transition-colors">Satılık / Kiralık Daireler</Link></li>
                <li><Link to="/ilanlar?category=RESIDENCE" className="hover:text-white transition-colors">Lüks Müstakil Villalar</Link></li>
                <li><Link to="/ilanlar?category=OFFICE" className="hover:text-white transition-colors">Plaza & Hazır Ofisler</Link></li>
                <li><Link to="/ilanlar?category=OFFICE" className="hover:text-white transition-colors">Cadde Mağaza & Dükkanlar</Link></li>
                <li><Link to="/ilanlar?category=LAND" className="hover:text-white transition-colors">İmarlı Konut & Ticari Arsalar</Link></li>
              </ul>
            </div>

            {/* Col 4: İletişim Bilgileri */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">İletişim & Ofis</h4>
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{addressDisplay}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`tel:${phoneDisplay}`} className="hover:text-white">{phoneDisplay}</a>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`mailto:${emailDisplay}`} className="hover:text-white">{emailDisplay}</a>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Mesaj At</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © {new Date().getFullYear()} {tenant?.name || 'Korkmaz İnşaat Emlak'}. Tüm hakları saklıdır.
            </div>
            <div className="flex items-center space-x-4">
              <span>KVKK Aydınlatma Metni</span>
              <span>•</span>
              <span>Gizlilik Politikası</span>
              <span>•</span>
              <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">
                Yönetici Girişi
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Merhaba,%20ilanlar%20hakkında%20bilgi%20almak%20istiyorum.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
        title="WhatsApp ile İletişime Geçin"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
          Bize Yazın
        </span>
      </a>
    </div>
  );
};
