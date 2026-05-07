import { useEffect, useState } from 'react';
import { Mail, Users, Bell, Save, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  getAdminContactSubmissions, updateAdminContactSubmission,
  getAdminNewsletterSubscribers, updateAdminNewsletterSubscriber, deleteAdminNewsletterSubscriber,
  getAdminPopupConfig, updateAdminPopupConfig,
} from '../../lib/api';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-MA', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Contact Submissions Tab ──────────────────────────────
function TabContact() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminContactSubmissions()
      .then(setSubmissions)
      .catch((e) => setError(e.message || 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  async function save(submission) {
    setSavingId(submission.id);
    try {
      const saved = await updateAdminContactSubmission(submission.id, { status: submission.status });
      setSubmissions((s) => s.map((x) => (x.id === saved.id ? saved : x)));
      setMessage('Mis à jour.');
    } catch (e) {
      setError(e.message || 'Erreur');
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <p className="text-stone-400 text-sm">Chargement...</p>;

  return (
    <div className="grid gap-4">
      {submissions.map((s) => (
        <div key={s.id} className="rounded-[1.7rem] bg-stone-50 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">#{s.id} · {s.source} · {formatDate(s.createdAt)}</p>
              <p className="mt-2 font-display text-2xl text-somacan-brand">{s.firstName} {s.lastName}</p>
              <p className="text-sm text-stone-500">{s.email}{s.phone ? ` · ${s.phone}` : ''}</p>
              {s.subject && <p className="text-xs text-stone-400 mt-1">Sujet : {s.subject}</p>}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <select
                value={s.status}
                onChange={(e) => setSubmissions((subs) => subs.map((x) => x.id === s.id ? { ...x, status: e.target.value } : x))}
                className="h-11 rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none"
              >
                <option value="new">Nouveau</option>
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolu</option>
                <option value="archived">Archivé</option>
              </select>
              <button
                type="button"
                onClick={() => save(s)}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
              >
                <Save size={13} />
                {savingId === s.id ? '...' : 'OK'}
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-[1.4rem] bg-white p-4 text-sm leading-7 text-stone-700 whitespace-pre-wrap">{s.message}</div>
        </div>
      ))}
      {!submissions.length && <p className="text-stone-400 text-sm">Aucun message.</p>}
      {message && <p className="text-emerald-600 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

// ── Newsletter Subscribers Tab ───────────────────────────
function TabNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminNewsletterSubscribers()
      .then(setSubscribers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(sub) {
    const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    await updateAdminNewsletterSubscriber(sub.id, { status: newStatus });
    setSubscribers((s) => s.map((x) => x.id === sub.id ? { ...x, status: newStatus } : x));
  }

  async function remove(sub) {
    if (!window.confirm(`Supprimer ${sub.email} ?`)) return;
    await deleteAdminNewsletterSubscriber(sub.id);
    setSubscribers((s) => s.filter((x) => x.id !== sub.id));
  }

  const active = subscribers.filter((s) => s.status === 'active').length;

  if (loading) return <p className="text-stone-400 text-sm">Chargement...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <span className="font-bold">{active}</span> actifs · <span className="font-bold">{subscribers.length}</span> total
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Email</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hidden md:table-cell">Prénom</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hidden md:table-cell">Source</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Statut</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hidden sm:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">{s.email}</td>
                <td className="px-4 py-3 text-stone-500 hidden md:table-cell">{s.firstName || '—'}</td>
                <td className="px-4 py-3 text-stone-400 text-xs hidden md:table-cell">{s.source}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                    s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {s.status === 'active' ? 'Actif' : 'Désinscrit'}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs hidden sm:table-cell">{formatDate(s.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button type="button" onClick={() => toggle(s)} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700" title="Basculer statut">
                      {s.status === 'active' ? <ToggleRight size={16} className="text-emerald-600" /> : <ToggleLeft size={16} />}
                    </button>
                    <button type="button" onClick={() => remove(s)} className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!subscribers.length && (
          <p className="py-10 text-center text-sm text-stone-400">Aucun abonné.</p>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}

// ── Popup Config Tab ─────────────────────────────────────
const DEFAULT_POPUP = {
  enabled: false,
  triggerType: 'delay',
  triggerValue: 5,
  showOnce: true,
  cookieDays: 7,
  title: 'Rejoignez le cercle',
  subtitle: 'Cercle privé',
  description: 'Rejoignez notre cercle et accédez en exclusivité aux nouvelles collections.',
  buttonText: "S'abonner",
  placeholder: 'Votre email',
  disclaimer: 'Pas de spam · Désinscription libre à tout moment',
  successMessage: 'Vous êtes des nôtres.',
  bgColor: '#033a22',
  textColor: '#ffffff',
  collectName: false,
  showConditions: '',
};

function TabPopup() {
  const [form, setForm] = useState(DEFAULT_POPUP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminPopupConfig()
      .then((data) => setForm({ ...DEFAULT_POPUP, ...data }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await updateAdminPopupConfig(form);
      setMessage('Popup sauvegardé.');
    } catch (err) {
      setError(err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-stone-400 text-sm">Chargement...</p>;

  const triggerLabels = { delay: 'secondes', scroll: '% de scroll', exit: '(détection exit intent)' };

  return (
    <form onSubmit={handleSave} className="grid gap-6">

      {/* Enable toggle */}
      <div className="flex items-center justify-between rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
        <div>
          <p className="font-semibold text-stone-800">Activer le popup</p>
          <p className="text-xs text-stone-400 mt-1">Le popup s'affichera sur toutes les pages (sauf admin)</p>
        </div>
        <button
          type="button"
          onClick={() => set('enabled', !form.enabled)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${form.enabled ? 'bg-[#033a22]' : 'bg-stone-300'}`}
        >
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${form.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Trigger */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Déclenchement</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Type</label>
            <select value={form.triggerType} onChange={(e) => set('triggerType', e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none">
              <option value="delay">Délai (secondes)</option>
              <option value="scroll">Au scroll (%)</option>
              <option value="exit">Exit intent (souris quitte la page)</option>
            </select>
          </div>
          {form.triggerType !== 'exit' && (
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Valeur ({triggerLabels[form.triggerType]})
              </label>
              <input type="number" min={1} value={form.triggerValue} onChange={(e) => set('triggerValue', Number(e.target.value))}
                className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
            </div>
          )}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Cookie (jours)</label>
            <input type="number" min={1} value={form.cookieDays} onChange={(e) => set('cookieDays', Number(e.target.value))}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
            <p className="text-[10px] text-stone-400 mt-1">Délai avant re-affichage</p>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm text-stone-700">
          <input type="checkbox" checked={form.showOnce} onChange={(e) => set('showOnce', e.target.checked)} className="rounded" />
          Afficher une seule fois par visiteur (cookie)
        </label>
      </div>

      {/* Contenu */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Contenu</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Titre</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Sous-titre</label>
            <input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none resize-none" />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Texte bouton</label>
            <input value={form.buttonText} onChange={(e) => set('buttonText', e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Placeholder email</label>
            <input value={form.placeholder} onChange={(e) => set('placeholder', e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Message succès</label>
            <input value={form.successMessage} onChange={(e) => set('successMessage', e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Disclaimer</label>
            <input value={form.disclaimer} onChange={(e) => set('disclaimer', e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none" />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm text-stone-700">
          <input type="checkbox" checked={form.collectName} onChange={(e) => set('collectName', e.target.checked)} className="rounded" />
          Collecter le prénom
        </label>
      </div>

      {/* Apparence */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Apparence</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Couleur fond</label>
            <div className="mt-2 flex items-center gap-3">
              <input type="color" value={form.bgColor} onChange={(e) => set('bgColor', e.target.value)} className="h-11 w-16 rounded-xl border border-stone-200 cursor-pointer" />
              <input value={form.bgColor} onChange={(e) => set('bgColor', e.target.value)}
                className="flex-1 h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none font-mono" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Couleur texte</label>
            <div className="mt-2 flex items-center gap-3">
              <input type="color" value={form.textColor} onChange={(e) => set('textColor', e.target.value)} className="h-11 w-16 rounded-xl border border-stone-200 cursor-pointer" />
              <input value={form.textColor} onChange={(e) => set('textColor', e.target.value)}
                className="flex-1 h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none font-mono" />
            </div>
          </div>
        </div>
        {/* Preview */}
        <div className="mt-5 rounded-[1.5rem] overflow-hidden shadow-lg" style={{ backgroundColor: form.bgColor, color: form.textColor, maxWidth: 400 }}>
          <div className="p-6">
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-2">{form.subtitle || 'Cercle privé'}</p>
            <p className="font-bold text-2xl mb-2">{form.title || 'Rejoignez le cercle'}</p>
            {form.description && <p className="text-sm opacity-70 mb-4">{form.description}</p>}
            <div className="flex gap-2">
              <input readOnly placeholder={form.placeholder} className="flex-1 h-10 rounded-lg bg-white/10 border border-white/20 px-3 text-sm" style={{ color: form.textColor }} />
              <button type="button" className="h-10 px-4 rounded-lg bg-white text-stone-900 text-xs font-bold">{form.buttonText}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions RGPD */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">Conditions / RGPD (optionnel)</p>
        <textarea rows={3} value={form.showConditions} onChange={(e) => set('showConditions', e.target.value)}
          placeholder="Ex : En vous inscrivant, vous acceptez notre politique de confidentialité et consentez à recevoir nos communications."
          className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none resize-none" />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-stone-800 disabled:opacity-50">
          <Save size={14} />
          {saving ? 'Sauvegarde...' : 'Sauvegarder le popup'}
        </button>
      </div>

      {message && <p className="text-emerald-600 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}

// ── Main Component ───────────────────────────────────────
const TABS = [
  { key: 'contact', label: 'Messages contact', icon: Mail },
  { key: 'newsletter', label: 'Newsletter', icon: Users },
  { key: 'popup', label: 'Popup', icon: Bell },
];

export default function AdminForms() {
  const [tab, setTab] = useState('contact');

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-stone-100 bg-stone-50 p-1.5 mb-8">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === key ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'contact' && <TabContact />}
      {tab === 'newsletter' && <TabNewsletter />}
      {tab === 'popup' && <TabPopup />}
    </section>
  );
}
