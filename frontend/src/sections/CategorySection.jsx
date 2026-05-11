import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '../lib/api';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';
import { buildImageStyle, buildSectionLayoutStyle, buildTypographyStyle } from './sectionStyleUtils';

/**
 * Returns grid container class and a per-card class getter based on category count.
 *
 * n=1 : full-width single card
 * n=2 : 2 equal columns, 1 row
 * n=3 : 2 cols — first card col-span-2 on its own row, 2 small cards on next row
 *        → actually use col-span-1 big + stack: use 3-col trick: [2+1] layout
 *        Implementation: cols-3, first card col-span-2 row-span-1, rest col-span-1
 * n=4 : 4 equal cards on one line on desktop
 * n=5 : same as 4 but 5th card fills the remaining slot
 * n=6 : uniform 3×2 grid
 */
function getGridConfig(n) {
  switch (n) {
    case 1:
      return {
        gridClass: 'grid grid-cols-1',
        getCardClass: () => '',
        isBigCard: () => true,
      };

    case 2:
      return {
        gridClass: 'grid grid-cols-1 sm:grid-cols-2',
        getCardClass: () => '',
        isBigCard: () => false,
      };

    case 3:
      // 3-column grid: first card spans 2 cols, next two span 1 col each
      return {
        gridClass: 'grid grid-cols-1 sm:grid-cols-3',
        getCardClass: (i) => i === 0 ? 'sm:col-span-2' : 'col-span-1',
        isBigCard: (i) => i === 0,
      };

    case 4:
      // 4 equal cards on desktop
      return {
        gridClass: 'grid grid-cols-2 md:grid-cols-4',
        getCardClass: () => '',
        isBigCard: () => false,
      };

    case 5:
      // 4-col grid, first card 2×2 (top-left), 4 small cards fill remaining 2×2 area
      return {
        gridClass: 'grid grid-cols-2 md:grid-cols-4 grid-rows-2',
        getCardClass: (i) => i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1',
        isBigCard: (i) => i === 0,
      };

    case 6:
    default:
      // Uniform 3×2 grid
      return {
        gridClass: 'grid grid-cols-2 md:grid-cols-3 grid-rows-2',
        getCardClass: () => '',
        isBigCard: () => false,
      };
  }
}

export default function CategorySection({
  title,
  subtitle,
  categoryIds,
  showAllLink = '/shop',
  showAllLabel,
  cardHeight,
  gridGap,
  sectionMinHeight,
  contentMaxWidth,
  contentGap,
  columnsTemplate,
  alignItems,
  justifyContent,
  ...styleProps
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const titleStyle = buildTypographyStyle(styleProps, 'title');
  const subtitleStyle = buildTypographyStyle(styleProps, 'subtitle');
  const cardTitleStyle = buildTypographyStyle(styleProps, 'cardTitle');
  const cardImageStyle = buildImageStyle(styleProps, 'cardImage');
  const layoutStyle = buildSectionLayoutStyle({
    minHeight: sectionMinHeight,
    contentMaxWidth,
    contentGap,
    columnsTemplate,
    alignItems,
    justifyContent,
  });

  const categoryIdsKey = JSON.stringify(categoryIds);

  useEffect(() => {
    getCategories()
      .then(data => {
        const ids = categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0
          ? categoryIds.map(String)
          : null;
        const result = ids ? data.filter(cat => ids.includes(String(cat.id))) : data;
        if (ids) {
          result.sort((a, b) => ids.indexOf(String(a.id)) - ids.indexOf(String(b.id)));
        }
        setCategories(result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdsKey]);

  const { gridClass, getCardClass, isBigCard } = getGridConfig(categories.length);

  return (
    <section className="py-24 bg-[#fcfaf7]" style={{ minHeight: sectionMinHeight || undefined }}>
      <div className="section-padding w-full" style={layoutStyle}>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-5 flex items-center gap-4" style={subtitleStyle}>
              <span className="w-8 h-px bg-stone-200" />
              {subtitle || 'Nos Univers'}
            </p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-somacan-brand leading-tight" style={titleStyle}>
              {title || (
                <>Explorer par <br />
                  <span className="italic text-stone-400 font-light">catégorie.</span>
                </>
              )}
            </h2>
          </div>
          {showAllLink && (
            <Link
              to={showAllLink}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 border-b border-stone-200 pb-2 hover:border-stone-900 transition-all flex items-center gap-3 self-start md:self-auto"
            >
              {showAllLabel || 'Voir tout'} <ArrowRight size={14} strokeWidth={1} />
            </Link>
          )}
        </header>

        {/* Grid */}
        {loading ? (
          <div className="h-[360px] md:h-[500px] flex items-center justify-center">
            <div className="w-10 h-10 border-t-2 border-stone-300 rounded-full animate-spin" />
          </div>
        ) : (
          <div
            className={gridClass}
            style={{ height: cardHeight || 'clamp(360px, 60vw, 500px)', gap: gridGap || '1rem' }}
          >
            {categories.map((cat, i) => {
              const big = isBigCard(i);
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className={`group relative overflow-hidden rounded-[1.75rem] ${getCardClass(i)}`}
                >
                  {/* Image */}
                  {cat.image ? (
                    <img
                      src={resolveCmsAssetUrl(cat.image)}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07]"
                      style={cardImageStyle}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-stone-200" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/20 to-transparent transition-colors duration-700 group-hover:from-stone-950/90" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-2 transition-transform duration-500 group-hover:-translate-y-1">
                      Somacan Collections
                    </p>
                    <h3 className={`font-display text-white leading-[1] mb-3 transition-transform duration-500 group-hover:-translate-y-1 ${
                      big ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-2xl md:text-3xl'
                    }`} style={cardTitleStyle}>
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-stone-400 uppercase tracking-[0.3em]">
                        {cat.productCount > 0 ? `${cat.productCount} produits` : 'Découvrir'}
                      </span>
                      <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        Explorer <ArrowRight size={13} strokeWidth={1.5} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
