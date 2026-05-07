import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Package, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestPasswordReset } from '../lib/api';

const initialForm = {
  email: '',
  password: '',
};

const assurances = [
  {
    icon: Package,
    title: 'Historique centralise',
    text: 'Retrouvez vos commandes, leur statut et leurs details depuis un seul espace.',
  },
  {
    icon: ShieldCheck,
    title: 'Connexion securisee',
    text: 'Votre acces client est relie au backend d authentification et a votre compte réel.',
  },
  {
    icon: Sparkles,
    title: 'Routine simplifiee',
    text: 'Vos prochaines commandes deviennent plus fluides avec vos informations deja connues.',
  },
];

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetState, setResetState] = useState('idle');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/account';

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(form);
      setSuccess(true);
      window.setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 700);
    } catch (submissionError) {
      setError(submissionError.message || 'Connexion impossible pour le moment.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordReset(event) {
    event.preventDefault();
    setResetState('loading');

    try {
      await requestPasswordReset({ email: resetEmail });
      setResetState('success');
    } catch {
      setResetState('error');
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(201,170,115,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(4,57,32,0.08),transparent_30%),#fcfaf7] pt-24 pb-20">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-stretch">
          <section className="relative overflow-hidden rounded-[2.8rem] bg-stone-900 px-8 py-10 text-stone-100 shadow-[0_30px_110px_rgba(28,25,23,0.18)] md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,170,115,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_28%)]" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.46em] text-stone-500">Connexion</p>
              <h1 className="mt-5 font-display text-5xl leading-[0.88] text-white md:text-7xl">
                Retrouver
                <br />
                <span className="font-light italic text-gold-400">votre espace client.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-[16px] font-light leading-8 text-stone-300">
                Connectez-vous pour suivre vos commandes, consulter votre historique et garder votre parcours Somacan dans une seule interface.
              </p>

              <div className="mt-12 grid gap-4">
                {assurances.map((item) => (
                  <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                    <item.icon className="text-gold-400" size={18} />
                    <h2 className="mt-4 font-display text-2xl text-white">{item.title}</h2>
                    <p className="mt-3 text-sm font-light leading-7 text-stone-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative rounded-[2.8rem] border border-stone-200/70 bg-white/86 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.07)] backdrop-blur-sm md:p-10">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#043920] text-white shadow-[0_14px_30px_rgba(4,57,32,0.22)]">
                <LockKeyhole size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">Acces membre</p>
                <h2 className="mt-2 font-display text-3xl text-somacan-brand">Se connecter</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Email</span>
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                  <Mail className="text-stone-400" size={16} />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={updateField}
                    className="h-full w-full bg-transparent text-sm text-stone-900 outline-none"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Mot de passe</span>
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                  <LockKeyhole className="text-stone-400" size={16} />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={updateField}
                    className="h-full w-full bg-transparent text-sm text-stone-900 outline-none"
                    placeholder="Votre mot de passe"
                  />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-stone-400 hover:text-stone-800">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} />
                    Connexion reussie. Redirection vers votre espace client...
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary w-full justify-center">
                {submitting ? 'Connexion...' : 'Entrer dans mon espace'}
                <ArrowRight size={14} />
              </button>

              <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Mot de passe oublie</p>
                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    placeholder="Votre email"
                    className="h-12 flex-1 rounded-full border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none focus:border-[#043920]"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={resetState === 'loading' || !resetEmail.trim()}
                    className="rounded-full bg-stone-900 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resetState === 'loading' ? 'Envoi...' : 'Recevoir un lien'}
                  </button>
                </div>
                {resetState === 'success' && (
                  <p className="mt-3 text-sm text-emerald-700">
                    Demande enregistree. Le backend repond bien sur cet endpoint; l envoi email final reste la prochaine etape.
                  </p>
                )}
                {resetState === 'error' && (
                  <p className="mt-3 text-sm text-red-600">
                    Impossible de traiter cette demande pour le moment.
                  </p>
                )}
              </div>

              <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50 px-5 py-4 text-sm leading-7 text-stone-500">
                Cette page est connectee au backend client. Elle envoie votre `email` et votre `password` au point d entree de connexion puis ouvre le dashboard une fois la session validee.
              </div>

              <p className="text-center text-sm text-stone-500">
                Pas encore de compte ?
                {' '}
                <Link to="/register" className="font-medium text-somacan-brand hover:text-stone-900">
                  Creer un espace client
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
