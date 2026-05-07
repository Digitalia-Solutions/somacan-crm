import { useEffect, useState } from 'react';
import { Mail, Save, Send, Eye, EyeOff } from 'lucide-react';
import { getAdminEmailSettings, updateAdminEmailSettings, testAdminEmailSettings } from '../../lib/api';

const INITIAL = {
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  mailFrom: '',
  adminEmail: '',
};

export default function AdminEmail() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminEmailSettings()
      .then((data) => setForm({ ...INITIAL, ...data }))
      .catch((err) => setError(err.message || 'Impossible de charger la config email.'))
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
      await updateAdminEmailSettings(form);
      setMessage('Configuration email sauvegardée.');
    } catch (err) {
      setError(err.message || 'Erreur de sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setMessage('');
    setError('');
    try {
      const res = await testAdminEmailSettings();
      setMessage(res.message || 'Email de test envoyé.');
    } catch (err) {
      setError(err.message || 'Échec du test SMTP.');
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-stone-400">Chargement...</div>;
  }

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <div className="flex items-center gap-3 mb-8">
        <Mail className="text-[#043920]" size={20} />
        <div>
          <h2 className="font-display text-3xl text-somacan-brand">Configuration Email</h2>
          <p className="text-xs text-stone-400 mt-1">Notifications formulaires · Auto-reply clients · Confirmations commandes</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-8">

        {/* SMTP Server */}
        <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Serveur SMTP</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Hôte SMTP
              </label>
              <input
                value={form.smtpHost}
                onChange={(e) => set('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
                className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#043920]"
              />
              <p className="mt-1 text-[10px] text-stone-400">Gmail: smtp.gmail.com · Brevo: smtp-relay.brevo.com</p>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Port
              </label>
              <select
                value={form.smtpPort}
                onChange={(e) => set('smtpPort', Number(e.target.value))}
                className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#043920]"
              >
                <option value={587}>587 — TLS (recommandé)</option>
                <option value={465}>465 — SSL</option>
                <option value={25}>25 — Non sécurisé</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Utilisateur SMTP
              </label>
              <input
                value={form.smtpUser}
                onChange={(e) => set('smtpUser', e.target.value)}
                placeholder="votre@gmail.com"
                className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#043920]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Mot de passe / App Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.smtpPass}
                  onChange={(e) => set('smtpPass', e.target.value)}
                  placeholder="App Password Gmail (16 caractères)"
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white px-4 pr-11 text-sm outline-none focus:border-[#043920]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-1 text-[10px] text-stone-400">
                Gmail : compte Google → Sécurité → Mots de passe d'application
              </p>
            </div>
          </div>
        </div>

        {/* Adresses */}
        <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">Adresses Email</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Expéditeur (From)
              </label>
              <input
                value={form.mailFrom}
                onChange={(e) => set('mailFrom', e.target.value)}
                placeholder='Somacan <contact@somacan.ma>'
                className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#043920]"
              />
              <p className="mt-1 text-[10px] text-stone-400">Affiché dans la boîte de réception du client</p>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Email Admin (notifications)
              </label>
              <input
                value={form.adminEmail}
                onChange={(e) => set('adminEmail', e.target.value)}
                placeholder="admin@somacan.ma"
                className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#043920]"
              />
              <p className="mt-1 text-[10px] text-stone-400">Reçoit les alertes formulaires et commandes</p>
            </div>
          </div>
        </div>

        {/* Aide rapide */}
        <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 mb-3">Guide rapide</p>
          <div className="grid gap-3 md:grid-cols-2 text-xs text-stone-600">
            <div>
              <p className="font-semibold text-stone-700 mb-1">Gmail</p>
              <p>Host: smtp.gmail.com · Port: 587</p>
              <p>User: votre@gmail.com</p>
              <p>Pass: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-[#043920] underline">App Password</a> (pas votre vrai mdp)</p>
            </div>
            <div>
              <p className="font-semibold text-stone-700 mb-1">Brevo (gratuit, 300/jour)</p>
              <p>Host: smtp-relay.brevo.com · Port: 587</p>
              <p>User: votre@email.com</p>
              <p>Pass: Clé SMTP dans votre compte Brevo</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-stone-800 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !form.adminEmail || !form.smtpHost}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:bg-stone-50 disabled:opacity-40"
          >
            <Send size={14} />
            {testing ? 'Envoi...' : 'Tester la config'}
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  );
}
