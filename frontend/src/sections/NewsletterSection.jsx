import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../lib/api';

export default function NewsletterSection({
  eyebrow,
  title,
  subtitle,
  description,
  placeholder,
  buttonText,
  successEyebrow,
  successMessage,
  disclaimer,
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await subscribeNewsletter({ email: email.trim(), source: 'newsletter_section' });
      setStatus('success');
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('déjà')) {
        setStatus('success'); // treat already subscribed as success
      } else {
        setErrorMsg(msg || 'Une erreur est survenue.');
        setStatus('error');
      }
    }
  };

  return (
    <section className="py-28 bg-stone-900 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-stone-700/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-700/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-padding max-w-[88rem] mx-auto text-center relative z-10">
        <p className="nl-content text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 mb-8">
          {eyebrow || 'Cercle Privé'}
        </p>

        <h2 className="nl-content font-display text-5xl md:text-8xl text-white leading-tight mb-8">
          {title || "L'excellence,"} <br />
          <span className="italic text-stone-500 font-light">{subtitle || 'en avant-première.'}</span>
        </h2>

        <p className="nl-content text-lg text-stone-400 font-light leading-relaxed mb-16 max-w-lg mx-auto">
          {description || 'Rejoignez notre cercle et accédez en exclusivité aux nouvelles collections, rituels secrets et offres réservées à nos membres.'}
        </p>

        <div className="nl-content">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center py-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 mb-3">
                  {successEyebrow || 'Bienvenue dans le cercle'}
                </p>
                <p className="font-display text-3xl text-white italic">{successMessage || 'Vous êtes des nôtres.'}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder || 'Votre adresse email'}
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 bg-white text-stone-900 hover:bg-stone-100 hover:shadow-xl whitespace-nowrap disabled:opacity-60"
                >
                  {status === 'loading' ? '...' : (buttonText || 'Rejoindre')}
                  <ArrowRight size={14} />
                </button>
              </motion.form>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm mt-4">{errorMsg}</p>
            )}
          </AnimatePresence>

          <p className="text-[9px] text-stone-700 uppercase tracking-widest mt-8">
            {disclaimer || 'Pas de spam · Désinscription libre à tout moment'}
          </p>
        </div>
      </div>
    </section>
  );
}
