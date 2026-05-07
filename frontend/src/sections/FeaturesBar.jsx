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

export default function FeaturesBar({ items }) {
  const currentItems = items && items.length > 0 ? items : features;
  return (
    <div className="py-16 bg-stone-900 overflow-hidden relative border-t border-white/5">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {currentItems.map((feature, j) => (
              <div key={j} className="flex items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-stone-500 italic px-12 whitespace-nowrap">
                  {feature.label || feature.text || feature}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-stone-700 shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
