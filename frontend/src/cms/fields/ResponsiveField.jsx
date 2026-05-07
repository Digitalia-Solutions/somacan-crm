import { useState } from 'react';
import SwitchField from './SwitchField';

const BREAKPOINTS = [
  { key: 'desktop', label: 'Desktop', icon: '🖥' },
  { key: 'tablet', label: 'Tablette', icon: '📱' },
  { key: 'mobile', label: 'Mobile', icon: '📲' },
];

export default function ResponsiveField({ label, value, onChange }) {
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
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}

      {/* Tab bar */}
      <div className="flex border border-stone-200 rounded-xl overflow-hidden">
        {BREAKPOINTS.map(({ key, label: bpLabel, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition ${
              activeTab === key
                ? 'bg-[#033a22] text-white'
                : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
            }`}
          >
            <span>{icon}</span>
            <span>{bpLabel}</span>
          </button>
        ))}
      </div>

      {/* Breakpoint fields */}
      <div className="border border-stone-200 rounded-xl bg-stone-50 p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500">Padding</label>
          <input
            type="text"
            value={current.padding ?? ''}
            onChange={(e) => update(activeTab, 'padding', e.target.value)}
            placeholder="ex: 4rem 2rem"
            className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500">Margin</label>
          <input
            type="text"
            value={current.margin ?? ''}
            onChange={(e) => update(activeTab, 'margin', e.target.value)}
            placeholder="ex: 0 auto 3rem"
            className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500">Width</label>
          <input
            type="text"
            value={current.width ?? ''}
            onChange={(e) => update(activeTab, 'width', e.target.value)}
            placeholder="ex: 50% / 320px"
            className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500">Alignment</label>
          <select
            value={current.alignment ?? 'inherit'}
            onChange={(e) => update(activeTab, 'alignment', e.target.value)}
            className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          >
            <option value="inherit">Inherit</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-500">Font size</label>
            <input
              type="text"
              value={current.typography?.fontSize ?? ''}
              onChange={(e) => update(activeTab, 'typography', { ...(current.typography || {}), fontSize: e.target.value })}
              placeholder="ex: 1rem"
              className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-500">Line height</label>
            <input
              type="text"
              value={current.typography?.lineHeight ?? ''}
              onChange={(e) => update(activeTab, 'typography', { ...(current.typography || {}), lineHeight: e.target.value })}
              placeholder="ex: 1.5"
              className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-500">Letter spacing</label>
            <input
              type="text"
              value={current.typography?.letterSpacing ?? ''}
              onChange={(e) => update(activeTab, 'typography', { ...(current.typography || {}), letterSpacing: e.target.value })}
              placeholder="ex: -0.02em"
              className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
            />
          </div>
        </div>
        <SwitchField
          label="Visible"
          value={current.visible !== false}
          onChange={(val) => update(activeTab, 'visible', val)}
        />
      </div>
    </div>
  );
}
