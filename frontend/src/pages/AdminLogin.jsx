import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, Mail } from 'lucide-react';
import { ADMIN_STORAGE_KEY, loginAdmin } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [apiKey, setApiKey] = useState(() => window.localStorage.getItem(ADMIN_STORAGE_KEY) || '');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { acceptAuthPayload } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/admin';

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleAdminLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = await loginAdmin(form);
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
      acceptAuthPayload(data);
      navigate(redirectTo, { replace: true });
    } catch (submissionError) {
      setError(submissionError.message || 'Connexion admin impossible pour le moment.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleApiKey(event) {
    event.preventDefault();
    setError('');

    if (!apiKey.trim()) {
      setError('Entrez une cle admin valide.');
      return;
    }

    window.localStorage.setItem(ADMIN_STORAGE_KEY, apiKey.trim());
    navigate('/admin', { replace: true });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(201,170,115,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(4,57,32,0.08),transparent_30%),#fcfaf7] pt-24 pb-20">
      <div className="section-padding mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <section className="relative overflow-hidden rounded-[2.8rem] bg-stone-900 px-8 py-10 text-stone-100 shadow-[0_30px_110px_rgba(28,25,23,0.18)] md:px-12 md:py-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.46em] text-stone-500">Administration</p>
            <h1 className="mt-5 font-display text-5xl leading-[0.88] text-white md:text-7xl">
              Acces
              <br />
              <span className="font-light italic text-gold-400">back office.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[16px] font-light leading-8 text-stone-300">
              Connectez-vous avec un vrai compte admin. La cle API reste disponible comme acces de secours ou de maintenance.
            </p>
          </section>

          <section className="rounded-[2.8rem] border border-stone-200/70 bg-white/86 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.07)] backdrop-blur-sm md:p-10">
            <div className="flex gap-3">
              <button type="button" onClick={() => setMode('login')} className={`rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] ${mode === 'login' ? 'bg-stone-900 text-white' : 'border border-stone-200 text-stone-600'}`}>
                Login admin
              </button>
              <button type="button" onClick={() => setMode('key')} className={`rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] ${mode === 'key' ? 'bg-stone-900 text-white' : 'border border-stone-200 text-stone-600'}`}>
                Cle API
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleAdminLogin} className="mt-10 grid gap-6">
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Email admin</span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5">
                    <Mail className="text-stone-400" size={16} />
                    <input name="email" type="email" required value={form.email} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" />
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Mot de passe</span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5">
                    <LockKeyhole className="text-stone-400" size={16} />
                    <input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-stone-400 hover:text-stone-800">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                {error && <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}

                <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary w-full justify-center">
                  {submitting ? 'Connexion...' : 'Ouvrir le panneau admin'}
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleApiKey} className="mt-10 grid gap-6">
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Cle admin</span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5">
                    <KeyRound className="text-stone-400" size={16} />
                    <input value={apiKey} onChange={(event) => setApiKey(event.target.value)} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" />
                  </div>
                </label>

                {error && <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}

                <button type="submit" className="btn-luxury btn-luxury-primary w-full justify-center">
                  Utiliser la cle API
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-stone-500">
              Retour au site
              {' '}
              <Link to="/" className="font-medium text-somacan-brand hover:text-stone-900">
                Accueil
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
