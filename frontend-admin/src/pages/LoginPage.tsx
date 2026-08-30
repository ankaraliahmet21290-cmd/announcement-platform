import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      {/* Left Branding Side */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-black text-2xl shadow-xl shadow-sky-500/30">
            E
          </div>
          <div>
            <div className="font-bold text-xl tracking-tight">Emlak Platformu</div>
            <div className="text-xs text-sky-400 font-medium">Multi-Tenant Portföy & Yönetim Sistemi</div>
          </div>
        </div>

        <div className="relative z-10 my-12 md:my-0 max-w-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white mb-4">
            Emlak Ofisinizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Modern ve Hızlı</span> Yönetin.
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Multi-tenant mimari ile ofisinize özel web sitesi, ilan portföyü, danışman performans takibi ve müşteri talep havuzu tek bir kontrol panelinde.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between pt-6 border-t border-slate-800/80">
          <span>Emlak Platform MVP © 2026</span>
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Online & H2 In-Memory</span>
          </span>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Panele Giriş Yap</h3>
            <p className="text-slate-500 text-sm mt-1.5">Lütfen hesap bilgilerinizi girerek devam edin.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                E-Posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ornek@emlak.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span>Giriş Yapılıyor...</span>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Hızlı Demo Giriş Butonları (Tek Tıkla Doldur)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@platform.com', 'Admin123!')}
                className="p-2.5 text-left rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 transition-colors"
              >
                <div className="text-xs font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Süper Admin</span>
                </div>
                <div className="text-[11px] text-purple-700 font-mono mt-0.5 truncate">admin@platform.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ofis@korkmaz.com', 'Ofis123!')}
                className="p-2.5 text-left rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 transition-colors"
              >
                <div className="text-xs font-bold flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Korkmaz Emlak (Ofis Yöneticisi)</span>
                </div>
                <div className="text-[11px] text-blue-700 font-mono mt-0.5 truncate">ofis@korkmaz.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ali.yilmaz@korkmaz.com', 'Agent123!')}
                className="p-2.5 text-left rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors"
              >
                <div className="text-xs font-bold flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Korkmaz Emlak (Danışman)</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-mono mt-0.5 truncate">ali.yilmaz@korkmaz.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ofis@ornek.com', 'Ofis123!')}
                className="p-2.5 text-left rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-colors"
              >
                <div className="text-xs font-bold flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Örnek Emlak (Ofis Yöneticisi)</span>
                </div>
                <div className="text-[11px] text-amber-700 font-mono mt-0.5 truncate">ofis@ornek.com</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
