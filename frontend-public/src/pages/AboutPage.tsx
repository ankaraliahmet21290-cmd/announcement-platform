import React from 'react';
import { useTenant } from '../context/TenantContext';
import { ShieldCheck, Award, Users, Target, Building2, CheckCircle2, Phone, MessageCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { tenant } = useTenant();

  const phoneDisplay = tenant?.phone || '+90 216 345 67 89';
  const whatsappNumber = tenant?.whatsapp || '905321112233';

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-bold rounded-full">
            Kurumsal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hakkımızda & Değerlerimiz
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            {tenant?.name || 'Korkmaz İnşaat Emlak'}, gayrimenkul sektöründe güvenilirliği ve profesyonelliği ön planda tutan bir danışmanlık firmasıdır.
          </p>
        </div>
      </section>

      {/* Main Story & Vision */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kuruluş Hikayemiz</h2>
            <div className="text-sm text-slate-700 leading-relaxed space-y-4 mt-4">
              <p>
                {tenant?.aboutText ||
                  'Korkmaz İnşaat Emlak olarak, kuruluşumuzdan bugüne müşteri memnuniyetini en üst düzeyde tutmayı ilke edindik. Anadolu Yakası başta olmak üzere lüks konut, ticari mülk ve arsa yatırımlarında bölgenin en yetkin kadrosuyla hizmet veriyoruz.'}
              </p>
              <p>
                Sektördeki dinamikleri ve yasal mevzuatları (EİDS, Taşınmaz Ticareti Yönetmeliği vb.) yakından takip ederek alıcı ve satıcı haklarını güvence altına alıyoruz. Mülkünüzün gerçek piyasa değerini belirleme, hedef kitleye özel pazarlama stratejileri ve tapu devir süreçlerine kadar her aşamada şeffaf bir hizmet sunuyoruz.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="p-5 bg-slate-50 rounded-2xl space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Misyonumuz</h3>
              <p className="text-xs text-slate-600">
                Müşterilerimizin gayrimenkul ihtiyaçlarını en doğru, hızlı ve şeffaf şekilde karşılamak.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Vizyonumuz</h3>
              <p className="text-xs text-slate-600">
                Bölgemizde modern teknolojiyi ve sektörel dürüstlüğü birleştiren öncü gayrimenkul markası olmak.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">İlkelerimiz</h3>
              <p className="text-xs text-slate-600">
                Güvenilirlik, şeffaflık, mevzuata tam uyum ve sürdürülebilir müşteri ilişkileri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-sky-600/20">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">Bizimle İletişime Geçin</h3>
            <p className="text-xs sm:text-sm text-sky-100">
              Gayrimenkul alım, satım veya kiralama süreçleriniz için profesyonel danışmanlarımız hazır.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={`tel:${phoneDisplay}`}
              className="px-5 py-2.5 bg-white text-sky-700 font-bold rounded-xl text-xs hover:bg-sky-50 transition-colors shadow-sm"
            >
              Hemen Arayın
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              WhatsApp Yazın
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
