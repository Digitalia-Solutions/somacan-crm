import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight as ArrowRightIcon } from 'lucide-react';
import { buildImageStyle, buildSectionLayoutStyle, buildTypographyStyle } from './sectionStyleUtils';

export default function BlogPreview({
  title,
  subtitle,
  maxItems,
  gridGap,
  sectionMinHeight,
  contentMaxWidth,
  contentGap,
  columnsTemplate,
  alignItems,
  justifyContent,
  ...styleProps
}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const titleStyle = buildTypographyStyle(styleProps, 'title');
  const subtitleStyle = buildTypographyStyle(styleProps, 'subtitle');
  const cardTitleStyle = buildTypographyStyle(styleProps, 'cardTitle');
  const cardExcerptStyle = buildTypographyStyle(styleProps, 'cardExcerpt');
  const cardImageStyle = buildImageStyle(styleProps, 'cardImage');
  const layoutStyle = buildSectionLayoutStyle({
    minHeight: sectionMinHeight,
    contentMaxWidth,
    contentGap,
    columnsTemplate,
    alignItems,
    justifyContent,
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/blogs')
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.blogs || []);
        setArticles(items.slice(0, Number(maxItems) > 0 ? Number(maxItems) : 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [maxItems]);

  return (
    <section className="py-24 bg-[#fcfaf7] overflow-hidden" style={{ minHeight: sectionMinHeight || undefined }}>
      <div className="section-padding w-full" style={layoutStyle}>
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-8">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-stone-200" />
              Journal & Lifestyle
            </p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-8xl text-somacan-brand leading-tight" style={titleStyle}>
              {title || "Pensées &"} <br />
              <span className="italic text-stone-400 font-light" style={subtitleStyle}>{subtitle || "inspirations."}</span>
            </h2>
          </div>
          <Link to="/blog" className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 border-b border-stone-200 pb-2 hover:border-stone-900 transition-all flex items-center gap-3">
            Explorer le journal <ArrowRightIcon size={14} strokeWidth={1} />
          </Link>
        </header>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: gridGap || '2rem' }}
        >
          {loading ? (
             <div className="col-span-3 py-20 text-center text-stone-300">Chargement...</div>
          ) : articles.map((article, i) => (
            <motion.article 
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15 }}
              className="group cursor-pointer rounded-[2rem] border border-stone-200/70 bg-white/70 p-5 backdrop-blur-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(28,25,23,0.10)]"
            >
              <Link to={`/blog/${article.slug}`} className="block">
                <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-8 shadow-lg group-hover:shadow-2xl transition-shadow duration-1000">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    src={article.coverImage || article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                    style={cardImageStyle}
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-stone-900 text-[8px] font-bold uppercase tracking-widest rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-display text-3xl text-somacan-brand mb-4 group-hover:text-stone-500 transition-colors duration-500 leading-[1.05]" style={cardTitleStyle}>
                  {article.title}
                </h3>
                <p className="text-stone-500 text-[15px] font-light leading-relaxed mb-6 line-clamp-2" style={cardExcerptStyle}>
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900">
                  Lire l'article <ArrowRightIcon size={14} strokeWidth={1.25} />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
