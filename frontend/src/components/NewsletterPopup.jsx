import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { getPopupConfig, subscribeNewsletter } from '../lib/api';

const COOKIE_KEY = 'somacan_popup_seen';

function getCookie(name) {
  return document.cookie.split(';').some((c) => c.trim().startsWith(name + '='));
}

function setCookie(name, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=1; expires=${expires}; path=/`;
}

export default function NewsletterPopup() {
  const [config, setConfig] = useState(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getPopupConfig()
      .then((data) => {
        if (!data.enabled) return;
        if (data.showOnce && getCookie(COOKIE_KEY)) return;
        setConfig(data);

        if (data.triggerType === 'delay') {
          const t = setTimeout(() => setVisible(true), (data.triggerValue || 5) * 1000);
          return () => clearTimeout(t);
        }

        if (data.triggerType === 'scroll') {
          const threshold = (data.triggerValue || 40) / 100;
          const onScroll = () => {
            const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            if (scrolled >= threshold) {
              setVisible(true);
              window.removeEventListener('scroll', onScroll);
            }
          };
          window.addEventListener('scroll', onScroll, { passive: true });
          return () => window.removeEventListener('scroll', onScroll);
        }

        if (data.triggerType === 'exit') {
          const onMouseLeave = (e) => {
            if (e.clientY <= 0) {
              setVisible(true);
              document.removeEventListener('mouseleave', onMouseLeave);
            }
          };
          document.addEventListener('mouseleave', onMouseLeave);
          return () => document.removeEventListener('mouseleave', onMouseLeave);
        }
      })
      .catch(() => {});
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    if (config?.showOnce) setCookie(COOKIE_KEY, config.cookieDays || 7);
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await subscribeNewsletter({ email: email.trim(), firstName: firstName.trim(), source: 'popup' });
      setStatus('success');
      if (config?.showOnce) setCookie(COOKIE_KEY, config.cookieDays || 7);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('déjà')) {
        setStatus('success');
      } else {
        setErrorMsg(msg || 'Une erreur est survenue.');
        setStatus('error');
      }
    }
  };

  if (!config) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-6 z-[201] mx-auto max-w-lg rounded-[2rem] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.3)] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-10"
            style={{ backgroundColor: config.bgColor || '#033a22', color: config.textColor || '#ffffff' }}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Fermer"
            >
              <X size={18} style={{ color: config.textColor || '#ffffff' }} />
            </button>

            {status === 'success' ? (
              <div className="py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 mb-3">Bienvenue</p>
                <p className="font-display text-3xl italic" style={{ color: config.textColor }}>
                  {config.successMessage || 'Vous êtes des nôtres.'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50 mb-4">
                  {config.subtitle || 'Cercle privé'}
                </p>
                <h3 className="font-display text-3xl md:text-4xl leading-tight mb-3" style={{ color: config.textColor }}>
                  {config.title || 'Rejoignez le cercle'}
                </h3>
                {config.description && (
                  <p className="text-sm opacity-70 leading-relaxed mb-6">{config.description}</p>
                )}

                {/* Conditions / GDPR */}
                {config.showConditions && (
                  <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-6 opacity-80">
                    {config.showConditions}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-3">
                  {config.collectName && (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prénom"
                      className="h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm placeholder:opacity-50 focus:outline-none focus:border-white/30"
                      style={{ color: config.textColor }}
                    />
                  )}
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={config.placeholder || 'Votre email'}
                      required
                      className="flex-1 h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-sm placeholder:opacity-50 focus:outline-none focus:border-white/30"
                      style={{ color: config.textColor }}
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="h-12 px-5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-opacity disabled:opacity-60 bg-white text-stone-900 hover:opacity-90"
                    >
                      {status === 'loading' ? '...' : (config.buttonText || "S'abonner")}
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  {status === 'error' && <p className="text-red-300 text-xs">{errorMsg}</p>}
                </form>

                {config.disclaimer && (
                  <p className="mt-4 text-[9px] uppercase tracking-widest opacity-40">{config.disclaimer}</p>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
