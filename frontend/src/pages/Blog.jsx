import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/blogs/all`);
        setArticles(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-[#fcfaf7] pt-32 pb-24">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <header className="mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
                Journal Somacan
              </p>
              <h1 className="font-display text-5xl leading-tight text-somacan-brand md:text-8xl">
                Archives &<br />
                <span className="font-light italic text-stone-400">rituels éditoriaux.</span>
              </h1>
            </div>
            <p className="max-w-md text-sm font-light leading-relaxed text-stone-500">
              Science botanique, gestes de beauté et inspirations marocaines réunis dans un journal pensé comme une extension du soin.
            </p>
          </header>

          {loading ? (
            <div className="py-20 text-center text-stone-400">Chargement des articles...</div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, index) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: index * 0.08 }}
                  className="group"
                >
                  <Link to={`/blog/${article.slug}`} className="block">
                    <div className="mb-8 overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                          src={article.coverImage || article.image}
                          alt={article.title}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute left-6 top-6">
                          <span className="rounded-full bg-white/90 px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.3em] text-stone-900 backdrop-blur-sm">
                            {article.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h2 className="mb-4 font-serif text-2xl leading-tight text-stone-900 transition-colors duration-500 group-hover:text-somacan-brand">
                      {article.title}
                    </h2>
                    <p className="mb-6 text-[15px] font-light leading-relaxed text-stone-500">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-3 border-b border-stone-300 pb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-colors hover:border-stone-900">
                      Lire l'article
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
