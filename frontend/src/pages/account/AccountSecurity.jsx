import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { StatCard } from '../../components/account/AccountPanelLayout';
import { updatePassword } from '../../lib/api';

export default function AccountSecurity() {
  const { user } = useOutletContext();
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordState((current) => ({ ...current, [name]: value }));
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage('');
    setPasswordError('');

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordSaving(false);
      setPasswordError('La confirmation du nouveau mot de passe ne correspond pas.');
      return;
    }

    try {
      const data = await updatePassword({
        currentPassword: passwordState.currentPassword,
        newPassword: passwordState.newPassword,
      });
      setPasswordMessage(data.message || 'Mot de passe mis a jour.');
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setPasswordError(error.message || 'Impossible de modifier le mot de passe.');
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white">
          <KeyRound size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Acces</p>
          <h2 className="mt-2 font-display text-3xl text-somacan-brand">Securite du compte</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Session" value="Active" detail="Connecte sur cet appareil." />
        <StatCard label="Mot de passe" value="Protege" detail="Modification disponible ici." />
        <StatCard label="Email" value={user?.email ? 'Verifie' : 'A verifier'} detail="Utilise pour vos commandes." />
      </div>

      <form onSubmit={handlePasswordSubmit} className="mt-8 grid gap-5">
        <label className="grid gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Mot de passe actuel</span>
          <input
            name="currentPassword"
            type="password"
            value={passwordState.currentPassword}
            onChange={handlePasswordChange}
            className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Nouveau mot de passe</span>
            <input
              name="newPassword"
              type="password"
              value={passwordState.newPassword}
              onChange={handlePasswordChange}
              className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Confirmation</span>
            <input
              name="confirmPassword"
              type="password"
              value={passwordState.confirmPassword}
              onChange={handlePasswordChange}
              className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
            />
          </label>
        </div>

        {passwordMessage && (
          <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {passwordMessage}
          </div>
        )}

        {passwordError && (
          <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {passwordError}
          </div>
        )}

        <button type="submit" disabled={passwordSaving} className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit">
          {passwordSaving ? 'Mise a jour...' : 'Changer le mot de passe'}
        </button>
      </form>
    </section>
  );
}
