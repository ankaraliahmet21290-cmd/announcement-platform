import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, Filter, Home, MapPin, Maximize2, Bed, Building, Flame, Layers } from 'lucide-react';

const ROOM_OPTIONS = ['Stüdyo (1+0)','1+1','1.5+1','2+0','2+1','2.5+1','2+2','3+0','3+1','3.5+1','3+2','3+3','4+0','4+1','4.5+1','4+2','4+3','4+4','5+1','5+2','5+3','6+1','6+2','7+1','7+2','8+1','10 Üzeri'];
const BUILDING_AGE_OPTIONS = ['0 (Oturuma Hazır)','0 (Yapım Aşamasında)','1','2','3','4','5','6-10 arası','11-15 arası','16-20 arası','21-25 arası','26-30 arası','31 ve üzeri'];
const FLOOR_OPTIONS = ['Giriş Altı Kot','Bodrum Kat','Zemin Kat','Bahçe Katı','Giriş Katı','Yüksek Giriş','Çatı Katı','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','20','25','30 ve üzeri'];
const TOTAL_FLOOR_OPTIONS = ['1','2','3','4','5','6','7','8','9','10','12','15','20','25','30 ve üzeri'];
const HEATING_OPTIONS = ['Yok','Soba','Doğalgaz Sobası','Kat Kaloriferi','Merkezi','Merkezi (Pay Ölçer)','Kombi (Doğalgaz)','Kombi (Elektrik)','Yerden Isıtma','Klima','Fancoil Ünitesi','Güneş Enerjisi','Elektrikli Radyatör','Jeotermal','Şömine','VRV','Isı Pompası'];
const BATHROOM_OPTIONS = ['Yok','1','2','3','4','5','6','6 Üzeri'];
const DEED_OPTIONS = ['Kat Mülkiyetli','Kat İrtifaklı','Hisseli Tapu','Müstakil Tapulu','Arsa Tapulu','Kooperatif Hisseli Tapu'];
const USAGE_OPTIONS = ['Boş','Kiracılı','Mülk Sahibi'];
const PROPERTY_TYPE_OPTIONS = [
  { key: 'RESIDENCE', label: 'Konut (Daire / Villa)' },
  { key: 'OFFICE', label: 'İşyeri / Dükkan / Plaza' },
  { key: 'LAND', label: 'Arsa / Arazi' },
];

interface Props {
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSubmit: () => void;
  onClear: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; defaultOpen?: boolean; badge?: number; children: React.ReactNode }> = ({ title, icon, defaultOpen = false, badge, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-3">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-slate-800 hover:text-sky-600 transition-colors">
        <div className="flex items-center space-x-2">
          <span className="text-sky-600">{icon}</span>
          <span>{title}</span>
          {badge != null && badge > 0 && <span className="px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold">{badge}</span>}
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>
      {open && <div className="mt-2 pl-1 space-y-1.5">{children}</div>}
    </div>
  );
};

const CB: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer select-none text-xs text-slate-700 hover:text-sky-600 py-0.5">
    <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer" />
    <span className={checked ? 'font-bold text-sky-700' : 'font-medium'}>{label}</span>
  </label>
);

const TextInput: React.FC<{ placeholder: string; value: string; onChange: (v: string) => void }> = ({ placeholder, value, onChange }) => (
  <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none" />
);

const NumInput: React.FC<{ placeholder: string; value: string; onChange: (v: string) => void }> = ({ placeholder, value, onChange }) => (
  <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none" />
);

function toggleArr(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

export const FilterSidebar: React.FC<Props> = ({ values, onChange, onSubmit, onClear }) => {
  const g = (k: string, def: any = '') => values[k] ?? def;
  const arr = (k: string): string[] => values[k] ?? [];

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-3 text-xs">

      {/* Search */}
      <div className="pb-3 border-b border-slate-100">
        <label className="block font-bold text-slate-600 mb-1.5 text-[10px] uppercase tracking-wider">Anahtar Kelime</label>
        <div className="relative">
          <input type="text" value={g('search')} onChange={e => onChange('search', e.target.value)} placeholder="Başlık veya açıklamada ara..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none" />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* İşlem & Emlak Tipi */}
      <Section title="Kategori / İlan Tipi" icon={<Home className="w-3.5 h-3.5" />} defaultOpen>
        <div>
          <span className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">İşlem Tipi</span>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            {[{ k: '', l: 'Tümü' }, { k: 'SALE', l: 'Satılık' }, { k: 'RENT', l: 'Kiralık' }].map(t => (
              <button key={t.k} type="button" onClick={() => onChange('listingType', t.k)}
                className={`py-1.5 rounded-lg text-center text-xs font-semibold transition-colors ${g('listingType') === t.k ? 'bg-white text-sky-600 shadow font-bold' : 'text-slate-600'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <span className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Emlak Tipi</span>
          {PROPERTY_TYPE_OPTIONS.map(pt => (
            <CB key={pt.key} label={pt.label} checked={arr('propertyTypes').includes(pt.key)} onChange={() => onChange('propertyTypes', toggleArr(arr('propertyTypes'), pt.key))} />
          ))}
        </div>
      </Section>

      {/* Adres */}
      <Section title="Adres / Konum" icon={<MapPin className="w-3.5 h-3.5" />} defaultOpen>
        <TextInput placeholder="İl (İstanbul)" value={g('city')} onChange={v => onChange('city', v)} />
        <TextInput placeholder="İlçe (Kadıköy)" value={g('district')} onChange={v => onChange('district', v)} />
        <TextInput placeholder="Mahalle / Semt" value={g('neighborhood')} onChange={v => onChange('neighborhood', v)} />
      </Section>

      {/* Fiyat */}
      <Section title="Fiyat (TL)" icon={<span className="font-extrabold text-[12px]">₺</span>} defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          <NumInput placeholder="Min TL" value={g('minPrice')} onChange={v => onChange('minPrice', v)} />
          <NumInput placeholder="Max TL" value={g('maxPrice')} onChange={v => onChange('maxPrice', v)} />
        </div>
      </Section>

      {/* m² Brüt */}
      <Section title="m² (Brüt)" icon={<Maximize2 className="w-3.5 h-3.5" />} defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          <NumInput placeholder="Min m²" value={g('minArea')} onChange={v => onChange('minArea', v)} />
          <NumInput placeholder="Max m²" value={g('maxArea')} onChange={v => onChange('maxArea', v)} />
        </div>
      </Section>

      {/* m² Net */}
      <Section title="m² (Net)" icon={<Maximize2 className="w-3.5 h-3.5" />}>
        <div className="grid grid-cols-2 gap-2">
          <NumInput placeholder="Min m²" value={g('minNetArea')} onChange={v => onChange('minNetArea', v)} />
          <NumInput placeholder="Max m²" value={g('maxNetArea')} onChange={v => onChange('maxNetArea', v)} />
        </div>
      </Section>

      {/* Oda Sayısı */}
      <Section title="Oda Sayısı" icon={<Bed className="w-3.5 h-3.5" />} defaultOpen badge={arr('roomCounts').length}>
        <div className="max-h-48 overflow-y-auto pr-1 space-y-0.5">
          {ROOM_OPTIONS.map(r => (
            <CB key={r} label={r} checked={arr('roomCounts').includes(r)} onChange={() => onChange('roomCounts', toggleArr(arr('roomCounts'), r))} />
          ))}
        </div>
      </Section>

      {/* Bina Yaşı */}
      <Section title="Bina Yaşı" icon={<Building className="w-3.5 h-3.5" />} defaultOpen badge={arr('buildingAges').length}>
        {BUILDING_AGE_OPTIONS.map(a => (
          <CB key={a} label={a} checked={arr('buildingAges').includes(a)} onChange={() => onChange('buildingAges', toggleArr(arr('buildingAges'), a))} />
        ))}
      </Section>

      {/* Kat Sayısı */}
      <Section title="Kat Sayısı" icon={<Layers className="w-3.5 h-3.5" />} badge={arr('totalFloors').length}>
        <div className="max-h-36 overflow-y-auto pr-1 space-y-0.5">
          {TOTAL_FLOOR_OPTIONS.map(f => (
            <CB key={f} label={f} checked={arr('totalFloors').includes(f)} onChange={() => onChange('totalFloors', toggleArr(arr('totalFloors'), f))} />
          ))}
        </div>
      </Section>

      {/* Bulunduğu Kat */}
      <Section title="Bulunduğu Kat" icon={<Layers className="w-3.5 h-3.5" />} badge={arr('floors').length}>
        <div className="max-h-48 overflow-y-auto pr-1 space-y-0.5">
          {FLOOR_OPTIONS.map(f => (
            <CB key={f} label={f} checked={arr('floors').includes(f)} onChange={() => onChange('floors', toggleArr(arr('floors'), f))} />
          ))}
        </div>
      </Section>

      {/* Isıtma */}
      <Section title="Isıtma" icon={<Flame className="w-3.5 h-3.5" />} badge={arr('heatingTypes').length}>
        <div className="max-h-48 overflow-y-auto pr-1 space-y-0.5">
          {HEATING_OPTIONS.map(h => (
            <CB key={h} label={h} checked={arr('heatingTypes').includes(h)} onChange={() => onChange('heatingTypes', toggleArr(arr('heatingTypes'), h))} />
          ))}
        </div>
      </Section>

      {/* Banyo Sayısı */}
      <Section title="Banyo Sayısı" icon={<span className="text-[12px]">🚿</span>} badge={arr('bathroomCounts').length}>
        {BATHROOM_OPTIONS.map(b => (
          <CB key={b} label={b} checked={arr('bathroomCounts').includes(b)} onChange={() => onChange('bathroomCounts', toggleArr(arr('bathroomCounts'), b))} />
        ))}
      </Section>

      {/* Balkon / Asansör / Otopark / Site */}
      <Section title="Konut Özellikleri" icon={<Layers className="w-3.5 h-3.5" />}>
        {[
          { k: 'hasBalcony', l: 'Balkon Var' },
          { k: 'hasElevator', l: 'Asansör Var' },
          { k: 'hasParking', l: 'Otopark Var' },
          { k: 'inSite', l: 'Site İçerisinde' },
          { k: 'furnished', l: 'Eşyalı' },
          { k: 'suitableForLoan', l: 'Krediye Uygun' },
        ].map(f => (
          <label key={f.k} className="flex items-center space-x-2 cursor-pointer select-none text-xs text-slate-700 hover:text-sky-600 py-0.5">
            <input type="checkbox" checked={!!g(f.k, false)} onChange={e => onChange(f.k, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer" />
            <span className={g(f.k, false) ? 'font-bold text-sky-700' : 'font-medium'}>{f.l}</span>
          </label>
        ))}
      </Section>

      {/* Kullanım Durumu */}
      <Section title="Kullanım Durumu" icon={<span className="text-[12px]">🏠</span>} badge={arr('usageStatuses').length}>
        {USAGE_OPTIONS.map(u => (
          <CB key={u} label={u} checked={arr('usageStatuses').includes(u)} onChange={() => onChange('usageStatuses', toggleArr(arr('usageStatuses'), u))} />
        ))}
      </Section>

      {/* Tapu Durumu */}
      <Section title="Tapu Durumu" icon={<span className="text-[12px]">📄</span>} badge={arr('deedStatuses').length}>
        {DEED_OPTIONS.map(d => (
          <CB key={d} label={d} checked={arr('deedStatuses').includes(d)} onChange={() => onChange('deedStatuses', toggleArr(arr('deedStatuses'), d))} />
        ))}
      </Section>

      {/* Buttons */}
      <div className="pt-2 space-y-2">
        <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/25 transition-all flex items-center justify-center space-x-2">
          <Search className="w-3.5 h-3.5" /><span>Arama Yap</span>
        </button>
        <button type="button" onClick={onClear} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors flex items-center justify-center space-x-1.5">
          <RotateCcw className="w-3 h-3" /><span>Filtreleri Temizle</span>
        </button>
      </div>
    </form>
  );
};
