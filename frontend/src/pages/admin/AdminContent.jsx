import { useState } from 'react';
import { FileText, Menu } from 'lucide-react';
import PageBuilder from '../../components/admin/PageBuilder';
import MenuBuilder from '../../components/admin/MenuBuilder';

const TABS = [
  { key: 'pages', label: 'Page Builder', icon: FileText },
  { key: 'menus', label: 'Menu Manager', icon: Menu },
];

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('pages');

  return (
    <div className="grid gap-6">
      {/* Tab bar */}
      <div className="flex gap-2 rounded-2xl border border-stone-200/70 bg-white p-1.5 shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'pages' && <PageBuilder />}
      {activeTab === 'menus' && <MenuBuilder />}
    </div>
  );
}
