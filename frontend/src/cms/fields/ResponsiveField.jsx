import { useState } from 'react';
import { Monitor, Tablet, Smartphone, Eye, EyeOff } from 'lucide-react';
import SwitchField from './SwitchField';
import { FieldWrapper } from '../FieldRenderer';

const BREAKPOINTS = [
  { key: 'desktop', label: 'Desktop', icon: Monitor },
  { key: 'tablet', label: 'Tablette', icon: Tablet },
  { key: 'mobile', label: 'Mobile', icon: Smartphone },
];

export default function ResponsiveField({ label, value, onChange, hint, required, error, description }) {
  const [activeTab, setActiveTab] = useState('desktop');

  const responsive = value || {
    desktop: { padding: '', margin: '', visible: true, alignment: 'inherit', width: '', typography: {} },
    tablet: { padding: '', margin: '', visible: true, alignment: 'inherit', width: '', typography: {} },
    mobile: { padding: '', margin: '', visible: true, alignment: 'inherit', width: '', typography: {} },
  };

  function update(breakpoint, key, val) {
    onChange({
      ...responsive,
      [breakpoint]: {
        ...(responsive[breakpoint] || {}),
        [key]: val,
      },
    });
  }

  const current = responsive[activeTab] || { padding: '', margin: '', visible: true, alignment: 'inherit', width: '', typography: {} };

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="flex flex-col gap-4">
        {/* Tab bar */}
        <div className="flex bg-stone-100 rounded-xl p-1 gap-1">
          {BREAKPOINTS.map(({ key, label: bpLabel, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === key
                  ? 'bg-white text-stone-900 shadow-sm ring-1 ring-black/5'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{bpLabel}</span>
            </button>
          ))}
        </div>

        {/* Breakpoint fields */}
        <div className="grid gap-5 p-5 rounded-2xl border border-stone-200 bg-stone-50/50">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Padding</label>
              <input
                type="text"
                value={current.padding ?? ''}
                onChange={(e) => update(activeTab, 'padding', e.target.value)}
                placeholder="ex: 4rem 2rem"
                className="h-10 border border-stone-200 rounded-xl bg-white px-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Margin</label>
              <input
                type="text"
                value={current.margin ?? ''}
                onChange={(e) => update(activeTab, 'margin', e.target.value)}
                placeholder="ex: 0 auto 3rem"
                className="h-10 border border-stone-200 rounded-xl bg-white px-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Width</label>
              <input
                type="text"
                value={current.width ?? ''}
                onChange={(e) => update(activeTab, 'width', e.target.value)}
                placeholder="ex: 50% / 320px"
                className="h-10 border border-stone-200 rounded-xl bg-white px-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Alignment</label>
              <select
                value={current.alignment ?? 'inherit'}
                onChange={(e) => update(activeTab, 'alignment', e.target.value)}
                className="h-10 border border-stone-200 rounded-xl bg-white px-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all appearance-none"
              >
                <option value="inherit">Inherit</option>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
             <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-4">Typography Scale</p>
             <div className="grid gap-4 grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-stone-400">Font size</label>
                  <input
                    type="text"
                    value={current.typography?.fontSize ?? ''}
                    onChange={(e) => update(activeTab, 'typography', { ...(current.typography || {}), fontSize: e.target.value })}
                    placeholder="1rem"
                    className="h-10 border border-stone-200 rounded-xl bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-stone-900/5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-stone-400">Line height</label>
                  <input
                    type="text"
                    value={current.typography?.lineHeight ?? ''}
                    onChange={(e) => update(activeTab, 'typography', { ...(current.typography || {}), lineHeight: e.target.value })}
                    placeholder="1.5"
                    className="h-10 border border-stone-200 rounded-xl bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-stone-900/5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-stone-400">Letter sp.</label>
                  <input
                    type="text"
                    value={current.typography?.letterSpacing ?? ''}
                    onChange={(e) => update(activeTab, 'typography', { ...(current.typography || {}), letterSpacing: e.target.value })}
                    placeholder="-0.01em"
                    className="h-10 border border-stone-200 rounded-xl bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-stone-900/5"
                  />
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between pt-2">
             <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${current.visible !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                   {current.visible !== false ? <Eye size={14}/> : <EyeOff size={14}/>}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Visibilité sur {activeTab}</span>
             </div>
             <SwitchField
                value={current.visible !== false}
                onChange={(val) => update(activeTab, 'visible', val)}
              />
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
}
