import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, UserPlus } from 'lucide-react';
import { claimOrderAccount, getClaimOrderAccount } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ClaimOrderAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { acceptAuthPayload } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    orderId: '',
  });
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      setError('Lien de creation de compte invalide.');
      setLoading(false);
      return;
    }

    getClaimOrderAccount(token)
      .then((data) => {
        setPreview(data);
        setForm((current) => ({
          ...current,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
        }));
      })
      .catch((loadError) => {
        setError(loadError.message || 'Impossible de charger cette invitation.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

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

    setSubmitting(true);
    setError('');

    try {
      const data = await claimOrderAccount({
        token,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        password: form.password,
      });
      acceptAuthPayload(data);
      setSuccess(true);
      window.setTimeout(() => {
        navigate('/account/orders', { replace: true });
      }, 900);
    } catch (submissionError) {
      setError(submissionError.message || 'Impossible de creer le compte pour le moment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] pb-20 pt-24">
      <div className="section-padding mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-[2.8rem] bg-stone-900 px-8 py-10 text-stone-100 shadow-[0_30px_110px_rgba(28,25,23,0.18)] md:px-12 md:py-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.46em] text-stone-500">Invitation client</p>
            <h1 className="mt-5 font-display text-5xl leading-[0.88] text-white md:text-7xl">
              Creer votre
              <br />
              <span className="font-light italic text-gold-400">compte apres commande.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[16px] font-light leading-8 text-stone-300">
              Votre commande invite peut maintenant etre rattachee a un espace client pour suivre l historique et accelerer les prochains achats.
            </p>
            <div className="mt-10 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500">Commande</p>
              <p className="mt-3 text-xl text-white">#{preview.orderId || '--'}</p>
              <p className="mt-2 text-sm text-stone-300">{preview.email || 'Email invite'}</p>
            </div>
          </section>

          <section className="rounded-[2.8rem] border border-stone-200/70 bg-white/86 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.07)] backdrop-blur-sm md:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#043920] text-white shadow-[0_14px_30px_rgba(4,57,32,0.22)]">
                <UserPlus size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">Creation guidee</p>
                <h2 className="mt-2 font-display text-3xl text-somacan-brand">Finaliser votre compte</h2>
              </div>
            </div>

            {loading ? (
              <p className="mt-10 text-stone-500">Chargement de l invitation...</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Prenom</span>
                    <input name="firstName" value={form.firstName} onChange={updateField} required className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Nom</span>
                    <input name="lastName" value={form.lastName} onChange={updateField} required className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none" />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Telephone</span>
                  <input name="phone" value={form.phone} onChange={updateField} className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none" />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
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
                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Confirmation</span>
                    <div className="flex h-14 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5">
                      <LockKeyhole className="text-stone-400" size={16} />
                      <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={form.confirmPassword} onChange={updateField} className="h-full w-full bg-transparent text-sm text-stone-900 outline-none" />
                      <button type="button" onClick={() => setShowConfirmPassword((current) => !current)} className="text-stone-400 hover:text-stone-800">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </label>
                </div>

                {error && <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}
                {success && (
                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} />
                      Compte cree avec succes. Redirection vers votre espace client...
                    </div>
                  </div>
                )}

                <button type="submit" disabled={submitting || !token} className="btn-luxury btn-luxury-primary w-full justify-center">
                  {submitting ? 'Creation...' : 'Creer mon compte'}
                  <ArrowRight size={14} />
                </button>

                <p className="text-center text-sm text-stone-500">
                  Deja un compte ?
                  {' '}
                  <Link to="/login" className="font-medium text-somacan-brand hover:text-stone-900">Se connecter</Link>
                </p>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
