/**
 * BlogHero — CMS section reproducing the Blog page header.
 *
 * Usage:
 *   <BlogHero
 *     eyebrow="Journal Somacan"
 *     title="Archives &"
 *     titleItalic="rituels éditoriaux."
 *     description="Science botanique, gestes de beauté et inspirations marocaines réunis dans un journal pensé comme une extension du soin."
 *   />
 */

export default function BlogHero({
  eyebrow = 'Journal Somacan',
  title = 'Archives &',
  titleItalic = 'rituels éditoriaux.',
  description = "Science botanique, gestes de beauté et inspirations marocaines réunis dans un journal pensé comme une extension du soin.",
  contentMaxWidth,
  descriptionMaxWidth,
}) {
  return (
    <section className="section-padding pt-32 pb-0 bg-[#fcfaf7]">
      <div className="mx-auto" style={{ maxWidth: contentMaxWidth || '80rem' }}>
        <header className="mb-12 md:mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
              {eyebrow}
            </p>
            <h1 className="font-display text-4xl leading-tight text-somacan-brand md:text-6xl lg:text-8xl">
              {title}
              <br />
              <span className="font-light italic text-stone-400">{titleItalic}</span>
            </h1>
          </div>
          <p className="text-sm font-light leading-relaxed text-stone-500" style={{ maxWidth: descriptionMaxWidth || '28rem' }}>
            {description}
          </p>
        </header>
      </div>
    </section>
  );
}
