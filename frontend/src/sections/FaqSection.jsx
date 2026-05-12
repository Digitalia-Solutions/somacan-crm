import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildSectionLayoutStyle, buildTypographyStyle } from './sectionStyleUtils';

const faqs = [
  {
    question: 'Les soins Somacan conviennent-ils aux peaux sensibles ?',
    answer:
      "Oui. L'univers Somacan est pensé autour du confort cutané, de textures calmes et d'une gestuelle douce. Cela ne remplace pas un diagnostic dermatologique, mais la marque privilégie une approche mesurée et sensorielle.",
  },
  {
    question: 'Quelle est la différence entre vos huiles, sérums et rituels corps ?',
    answer:
      "Les huiles travaillent surtout la nutrition et le toucher, les sérums ciblent davantage la précision du geste et la concentration des actifs, tandis que les rituels corps prolongent l'expérience dans une logique plus enveloppante et quotidienne.",
  },
  {
    question: 'Comment commencer une routine Somacan ?',
    answer:
      "Le plus simple est de partir d'un geste central: nettoyer, appliquer un soin ciblé, puis sceller avec une texture plus riche si nécessaire. Une routine courte mais régulière donne généralement plus de cohérence qu'une accumulation de produits.",
  },
  {
    question: 'Vos produits sont-ils inspirés du patrimoine marocain ?',
    answer:
      "Oui. Somacan s'appuie sur les matières, les gestes et l'atmosphère du rituel marocain, puis les traduit dans une écriture plus contemporaine, plus minimale et plus précise.",
  },
  {
    question: 'Où puis-je découvrir toute la collection ?',
    answer:
      "La boutique regroupe l'ensemble des soins disponibles, tandis que le Journal et la page Notre Histoire expliquent la logique de la marque, ses inspirations et la façon d'intégrer chaque produit dans un rituel réel.",
  },
];

function FaqItem({ item, isOpen, onToggle, questionStyle, answerStyle }) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200/80 bg-white/75 backdrop-blur-sm shadow-[0_18px_50px_rgba(28,25,23,0.05)] sm:rounded-[2rem]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-4 py-5 text-left sm:gap-6 sm:px-8 sm:py-7"
      >
        <span className="pr-2 font-display text-lg leading-snug text-somacan-brand sm:pr-4 sm:text-2xl md:text-3xl" style={questionStyle}>
          {item.question}
        </span>
        <span className="mt-0.5 shrink-0 rounded-full border border-stone-200 p-1.5 text-stone-500 sm:mt-1 sm:p-2">
          <Plus
            size={14}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 sm:px-8 sm:pb-8">
              <div className="mb-4 h-px w-full bg-stone-100 sm:mb-5" />
              <p className="max-w-3xl text-sm font-light leading-7 text-stone-600 sm:text-[15px] sm:leading-8" style={answerStyle}>
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection({
  eyebrow,
  headline,
  description,
  ctaText,
  ctaLink,
  itemsGap,
  emptyMessage,
  items,
  allowMultipleOpen = false,
  defaultOpenIndex = 0,
  sectionMinHeight,
  contentMaxWidth,
  contentGap,
  columnsTemplate,
  alignItems,
  justifyContent,
  ...styleProps
}) {
  const currentFaqs = items && items.length > 0 ? items : faqs;
  const initialIndex = Number.isFinite(Number(defaultOpenIndex)) ? Number(defaultOpenIndex) : 0;
  const [openIndexes, setOpenIndexes] = useState(allowMultipleOpen ? [initialIndex] : [initialIndex]);
  const headlineStyle = buildTypographyStyle(styleProps, 'headline');
  const descriptionStyle = buildTypographyStyle(styleProps, 'description');
  const questionStyle = buildTypographyStyle(styleProps, 'question');
  const answerStyle = buildTypographyStyle(styleProps, 'answer');
  const layoutStyle = buildSectionLayoutStyle({
    minHeight: sectionMinHeight,
    contentMaxWidth,
    contentGap,
    columnsTemplate,
    alignItems,
    justifyContent,
  });

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#fcfaf7_0%,#f3efe8_100%)] py-24" style={{ minHeight: sectionMinHeight || undefined }}>
      <div className="section-padding w-full" style={layoutStyle}>
        <div className="mb-10 grid gap-8 sm:mb-14 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
              {eyebrow || 'FAQ'}
            </p>
            <h2 className="font-display text-3xl leading-[0.95] text-somacan-brand sm:text-5xl md:text-7xl" style={headlineStyle}>
              {headline ? headline.split(' ')[0] : 'Questions'}
              <br />
              <span className="font-light italic text-stone-400">
                {headline ? headline.split(' ').slice(1).join(' ') : 'fréquentes.'}
              </span>
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-[15px] font-light leading-7 text-stone-600 sm:text-[16px] sm:leading-8" style={descriptionStyle}>
              {description || 'Les réponses essentielles pour comprendre la logique Somacan, commencer un rituel cohérent et mieux naviguer dans la collection.'}
            </p>
            <Link
              to={ctaLink || '/about'}
              className="mt-6 inline-flex items-center gap-3 border-b border-stone-300 pb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-colors hover:border-stone-900 sm:mt-8"
            >
              {ctaText || 'Lire Notre Histoire'}
            </Link>
          </div>
        </div>

        <div className="grid" style={{ gap: itemsGap || '1.25rem' }}>
          {currentFaqs.length === 0 && (
            <div className="rounded-[1.5rem] border border-dashed border-stone-200 bg-white/70 px-6 py-10 text-center text-sm font-medium text-stone-400">
              {emptyMessage || 'Aucune question disponible pour le moment.'}
            </div>
          )}

          {currentFaqs.map((item, index) => (
            <FaqItem
              key={item.question || index}
              item={item}
              isOpen={openIndexes.includes(index)}
              questionStyle={questionStyle}
              answerStyle={answerStyle}
              onToggle={() => {
                if (allowMultipleOpen) {
                  setOpenIndexes((prev) => (
                    prev.includes(index) ? prev.filter((itemIndex) => itemIndex !== index) : [...prev, index]
                  ));
                  return;
                }
                setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
