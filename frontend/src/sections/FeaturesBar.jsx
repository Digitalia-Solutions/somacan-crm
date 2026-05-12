const features = [
  "Livraison Signature au Maroc",
  "Paiement Sécurisé & Chiffré",
  "Expertise Botanique Pure",
  "CBD de Grade Médicinal",
  "Héritage Artisanal",
  "Éthique & Cruelty-Free",
  "Naturel à 100%",
  "Dermatologiquement Testé",
].map((label) => ({ label }));

export default function FeaturesBar({ items, paddingY, itemGap, itemColor, dividerColor }) {
  const currentItems = items && items.length > 0 ? items : features;
  return (
    <div className="bg-stone-900 overflow-hidden relative border-t border-white/5" style={{ paddingBlock: paddingY || '4rem' }}>
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {currentItems.map((feature, j) => (
              <div key={j} className="flex items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] italic whitespace-nowrap" style={{ color: itemColor || '#78716c', paddingInline: itemGap || '3rem' }}>
                  {feature.label || feature.text || feature}
                </span>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dividerColor || '#44403c' }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
