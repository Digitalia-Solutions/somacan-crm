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
        gridClass: 'grid grid-cols-1 md:grid-cols-2',
        getCardClass: () => '',
        isBigCard: () => false,
      };

    case 3:
      // Mobile stays stacked; cinematic split starts on large screens.
      return {
        gridClass: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        getCardClass: (i) => i === 0 ? 'xl:col-span-2' : '',
        isBigCard: (i) => i === 0,
      };

    case 4:
      return {
        gridClass: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
        getCardClass: () => '',
        isBigCard: () => false,
      };

    case 5:
      // Keep mobile compact; large composition only activates at desktop sizes.
      return {
        gridClass: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2',
        getCardClass: (i) => i === 0 ? 'sm:col-span-2 xl:row-span-2' : '',
        isBigCard: (i) => i === 0,
      };

    case 6:
    default:
      return {
        gridClass: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2',
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
  cardEyebrow,
  emptyMessage,
  showProductCount = true,
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
  const titleClamp = titleStyle?.fontSize || 'clamp(2.2rem, 6vw, 5.8rem)';
  const subtitleClamp = subtitleStyle?.fontSize || 'clamp(0.62rem, 1.4vw, 0.74rem)';
  const cardGap = gridGap || 'clamp(0.85rem, 1.7vw, 1.35rem)';
  const desktopGridMinHeight = cardHeight || 'clamp(420px, 60vw, 560px)';

  return (
    <section className="overflow-x-clip bg-[#fcfaf7] py-16 sm:py-20 lg:py-24" style={{ minHeight: sectionMinHeight || undefined }}>
      <div className="section-padding w-full" style={layoutStyle}>

        <header className="mb-8 flex min-w-0 flex-col gap-5 sm:mb-10 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-[44rem]">
            <p
              className="mb-3 flex min-w-0 items-center gap-3 overflow-hidden text-stone-400 sm:mb-4 sm:gap-4"
              style={{
                ...subtitleStyle,
                fontSize: subtitleClamp,
                letterSpacing: '0.32em',
                lineHeight: 1.2,
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              <span className="h-px w-7 shrink-0 bg-stone-200 sm:w-8" />
              {subtitle || 'Nos Univers'}
            </p>
            <h2
              className="min-w-0 max-w-full overflow-hidden break-words font-display text-somacan-brand"
              style={{
                ...titleStyle,
                fontSize: titleClamp,
                lineHeight: 0.94,
                letterSpacing: '-0.05em',
                textWrap: 'balance',
              }}
            >
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
              className="inline-flex min-h-11 items-center gap-3 self-start rounded-full border border-stone-200/80 bg-white/70 px-5 py-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stone-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-900 hover:bg-white active:scale-[0.98] lg:self-auto"
            >
              {showAllLabel || 'Voir tout'} <ArrowRight size={14} strokeWidth={1} />
            </Link>
          )}
        </header>

        {loading ? (
          <div className="flex h-[260px] items-center justify-center sm:h-[320px] lg:h-[500px]">
            <div className="w-10 h-10 border-t-2 border-stone-300 rounded-full animate-spin" />
          </div>
        ) : (
          <div
            className={gridClass}
            style={{
              gap: cardGap,
              minHeight: categories.length > 2 ? desktopGridMinHeight : undefined,
            }}
          >
            {categories.length === 0 && (
              <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-[1.75rem] border border-dashed border-stone-200 bg-white/70 px-6 text-center text-sm font-medium text-stone-400">
                {emptyMessage || 'Aucune catégorie active à afficher pour le moment.'}
              </div>
            )}

            {categories.map((cat, i) => {
              const big = isBigCard(i);
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className={`group relative isolate min-h-[220px] overflow-hidden rounded-[1.65rem] border border-white/40 bg-stone-100 shadow-[0_18px_40px_-26px_rgba(24,24,23,0.45)] transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_28px_50px_-28px_rgba(24,24,23,0.55)] active:scale-[0.985] sm:min-h-[250px] lg:rounded-[1.9rem] xl:min-h-0 ${big ? 'lg:min-h-[340px] xl:min-h-[420px]' : 'lg:min-h-[300px] xl:min-h-[unset]'} ${getCardClass(i)}`}
                  style={{
                    minHeight: big ? 'clamp(14rem, 42vw, 32rem)' : 'clamp(13.75rem, 34vw, 22rem)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {cat.image ? (
                    <img
                      src={resolveCmsAssetUrl(cat.image)}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05] group-active:scale-[1.02]"
                      style={cardImageStyle}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-stone-200" />
                  )}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,25,23,0.05)_0%,rgba(28,25,23,0.12)_32%,rgba(17,15,14,0.72)_100%)] transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.14),transparent_60%)] opacity-70" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 lg:p-7">
                    <div className="max-w-[88%] sm:max-w-[82%]">
                    <p
                      className="mb-2 text-[0.48rem] font-bold uppercase tracking-[0.34em] text-stone-300 transition-transform duration-500 group-hover:-translate-y-1 sm:text-[0.54rem]"
                    >
                      {cardEyebrow || 'Somacan Collections'}
                    </p>
                    <h3
                      className="mb-3 font-display leading-[0.94] text-white transition-transform duration-500 group-hover:-translate-y-1"
                      style={{
                        ...cardTitleStyle,
                        fontSize: big
                          ? cardTitleStyle?.fontSize || 'clamp(1.7rem, 5.5vw, 4.7rem)'
                          : cardTitleStyle?.fontSize || 'clamp(1.35rem, 4.2vw, 2.5rem)',
                        letterSpacing: '-0.045em',
                        textWrap: 'balance',
                      }}
                    >
                      {cat.name}
                    </h3>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-white/90">
                      <span className="text-[0.52rem] uppercase tracking-[0.28em] text-stone-300 sm:text-[0.58rem]">
                        {showProductCount && cat.productCount > 0 ? `${cat.productCount} produits` : 'Découvrir'}
                      </span>
                      <span className="flex translate-y-0 items-center gap-2 text-[0.54rem] font-bold uppercase tracking-[0.28em] text-white transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-2 sm:opacity-70 sm:group-hover:opacity-100">
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
