import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, CheckCircle2, Eye, EyeOff, LockKeyhole, Phone, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const steps = [
  'Creation du compte client',
  'Acces au dashboard personnel',
  'Historique de commandes relie au profil',
];

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSuccess(true);
      window.setTimeout(() => {
        navigate('/account', { replace: true });
      }, 700);
    } catch (submissionError) {
      setError(submissionError.message || 'Inscription impossible pour le moment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(201,170,115,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(4,57,32,0.08),transparent_30%),#fcfaf7] pt-24 pb-20">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-stretch">
          <section className="relative overflow-hidden rounded-[2.8rem] border border-stone-200/70 bg-white/86 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.07)] backdrop-blur-sm md:p-10">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#043920] text-white shadow-[0_14px_30px_rgba(4,57,32,0.22)]">
                <UserPlus size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">Nouveau client</p>
                <h2 className="mt-2 font-display text-3xl text-somacan-brand">Creer un compte</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Prenom</span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                    <User className="text-stone-400" size={16} />
                    <input name="firstName" required value={form.firstName} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" placeholder="Votre prenom" />
                  </div>
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Nom</span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                    <User className="text-stone-400" size={16} />
                    <input name="lastName" required value={form.lastName} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" placeholder="Votre nom" />
                  </div>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Email</span>
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                  <AtSign className="text-stone-400" size={16} />
                  <input name="email" type="email" required value={form.email} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" placeholder="vous@exemple.com" />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Telephone</span>
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                  <Phone className="text-stone-400" size={16} />
                  <input name="phone" value={form.phone} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" placeholder="+212 ..." />
                </div>
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Mot de passe</span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                    <LockKeyhole className="text-stone-400" size={16} />
                    <input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" placeholder="Au moins 6 caracteres" />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-stone-400 hover:text-stone-800">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Confirmation</span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 transition-colors focus-within:border-[#043920] focus-within:bg-white">
                    <LockKeyhole className="text-stone-400" size={16} />
                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" placeholder="Ressaisir le mot de passe" />
                    <button type="button" onClick={() => setShowConfirmPassword((current) => !current)} className="text-stone-400 hover:text-stone-800">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>
              </div>

              {error && (
                <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} />
                    Compte cree avec succes. Redirection vers votre dashboard...
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary w-full justify-center">
                {submitting ? 'Creation...' : 'Creer mon espace client'}
                <ArrowRight size={14} />
              </button>

              <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50 px-5 py-4 text-sm leading-7 text-stone-500">
                Le formulaire est deja adapte au backend: il envoie `firstName`, `lastName`, `email`, `phone` et `password`, puis ouvre automatiquement le dashboard client une fois le compte cree.
              </div>

              <p className="text-center text-sm text-stone-500">
                Deja client ?
                {' '}
                <Link to="/login" className="font-medium text-somacan-brand hover:text-stone-900">
                  Se connecter
                </Link>
              </p>
            </form>
          </section>

          <section className="relative overflow-hidden rounded-[2.8rem] bg-stone-900 px-8 py-10 text-stone-100 shadow-[0_30px_110px_rgba(28,25,23,0.18)] md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,170,115,0.2),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_28%)]" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.46em] text-stone-500">Inscription</p>
              <h1 className="mt-5 font-display text-5xl leading-[0.88] text-white md:text-7xl">
                Un compte sobre,
                <br />
                <span className="font-light italic text-gold-400">utile et durable.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-[16px] font-light leading-8 text-stone-300">
                Votre espace client ne sert pas seulement a vous connecter. Il centralise vos commandes, fluidifie vos prochains achats et relie votre relation Somacan a un vrai historique.
              </p>

              <div className="mt-12 space-y-4">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold tracking-[0.2em] text-gold-400">
                      0{index + 1}
                    </div>
                    <p className="pt-2 text-sm font-light leading-7 text-stone-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
