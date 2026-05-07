import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

export default function BlogArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/blogs/${slug}`);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] pt-32 pb-24 text-center text-stone-400">
        Chargement de l'article...
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] pt-32 pb-24">
        <div className="section-padding">
          <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-12 text-center shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
            <h1 className="font-display text-4xl text-somacan-brand">Article introuvable</h1>
            <p className="mt-4 text-stone-500">Cet article n'existe pas ou n'est plus disponible.</p>
            <Link
              to="/blog"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#043920] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#fcfaf7]"
            >
              Retour au journal
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] pt-28 pb-24">
      <article>
        <section className="section-padding">
          <div className="mx-auto max-w-5xl">
            <Link
              to="/blog"
              className="mb-10 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 transition-colors hover:text-stone-900"
            >
              <ArrowLeft size={14} />
              Retour aux archives
            </Link>

            <div className="mb-12 max-w-3xl">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                <span>{article.category}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                <span>{article.readTime}</span>
              </div>
              <h1 className="font-display text-5xl leading-[0.95] text-somacan-brand md:text-7xl">
                {article.title}
              </h1>
              <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-stone-500">
                {article.intro}
              </p>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] shadow-[0_24px_80px_rgba(28,25,23,0.10)]">
              <img src={article.coverImage || article.image} alt={article.title} className="h-[28rem] w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="section-padding pt-16">
          <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-12">
              {article.sections && article.sections.map((section, idx) => (
                <section key={idx}>
                  <h2 className="mb-5 font-display text-3xl leading-tight text-somacan-brand md:text-4xl">
                    {section.heading}
                  </h2>
                  <p className="max-w-2xl text-[17px] font-light leading-8 text-stone-600 whitespace-pre-line">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-stone-400">
                Note éditoriale
              </p>
              <p className="mb-6 text-sm font-light leading-7 text-stone-500">
                Chaque article du Journal Somacan prolonge l'univers de la marque: botanique marocaine, précision cosmétique et rituels contemporains.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 border-b border-stone-300 pb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-colors hover:border-stone-900"
              >
                Découvrir Notre Histoire
                <ArrowRight size={14} />
              </Link>
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
