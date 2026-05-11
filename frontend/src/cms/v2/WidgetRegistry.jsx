import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, PlayCircle, Star } from 'lucide-react';
import { WIDGET_DEFINITIONS, WIDGET_TYPES, getWidgetDefinition } from '../../../../shared/cms/widgets.js';
import { resolvePresetStyle } from './GlobalStyleEngine';
import {
  buildResponsiveStyleVariables,
  buildResponsiveStylesheet,
  getResponsiveInlineStyle,
  getVisibilityClasses,
} from './ResponsiveEngine';
import { getFMVariants, isGSAPAnimation } from '../AnimationEngine';
import { motion } from 'framer-motion';
import useGSAPScrollAnimation, { useGSAPStaggerReveal } from './useGSAPScrollAnimation';

/**
 * WidgetShell
 *
 * Wraps every widget with:
 * - Preset style resolution
 * - Responsive CSS variable injection
 * - Visibility classes
 * - Animation (Framer Motion or GSAP ScrollTrigger)
 */
function WidgetShell({ widget, scope = 'typography', className = '', children }) {
  const ref = useRef(null);
  const classToken = `cms-widget-${widget.id}`;
  const style = {
    ...resolvePresetStyle(scope, widget.style?.presetId || widget.props?.variant, widget.style?.styles),
    ...buildResponsiveStyleVariables(widget.responsive, `--${classToken}`),
    ...getResponsiveInlineStyle(widget.responsive),
  };
  const visibilityClasses = getVisibilityClasses(widget.responsive);
  const stylesheet = buildResponsiveStylesheet(classToken, widget.responsive, `--${classToken}`);
  const variants = getFMVariants(widget.animation || {});
  const animationType = widget.animation?.type || 'none';
  const shouldAnimate = animationType !== 'none' && !isGSAPAnimation(animationType);
  const isGSAP = isGSAPAnimation(animationType);

  // Apply GSAP animations when applicable
  useGSAPScrollAnimation(ref, widget.animation || {}, [widget.id, animationType]);

  const content = (
    <>
      <style>{stylesheet}</style>
      {children}
    </>
  );

  if (!shouldAnimate) {
    return (
      <div
        ref={ref}
        className={`${classToken} ${visibilityClasses} ${className}`.trim()}
        style={style}
      >
        {content}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`${classToken} ${visibilityClasses} ${className}`.trim()}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      custom={widget.animation}
    >
      {content}
    </motion.div>
  );
}

/* ── Widget Renderers ─────────────────────────────────────────── */

function HeadingWidgetRenderer({ widget }) {
  const Tag = widget.props?.level || 'h2';
  return (
    <WidgetShell widget={widget}>
      <Tag className="font-display text-balance text-[clamp(2rem,4vw,4rem)] font-semibold tracking-[-0.04em] text-stone-900">
        {widget.props?.text}
      </Tag>
    </WidgetShell>
  );
}

function ParagraphWidgetRenderer({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div
        className="max-w-3xl text-base leading-7 text-stone-600"
        dangerouslySetInnerHTML={{ __html: widget.props?.text || '' }}
      />
    </WidgetShell>
  );
}

function ButtonWidgetRenderer({ widget }) {
  const href = widget.props?.href || '#';
  return (
    <WidgetShell widget={widget} scope="button" className="inline-flex">
      <Link to={href} className="inline-flex items-center justify-center text-sm font-semibold">
        {widget.props?.label || 'Button'}
      </Link>
    </WidgetShell>
  );
}

function ImageWidgetRenderer({ widget }) {
  if (!widget.props?.src) {
    return (
      <WidgetShell widget={widget} className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-100/80 p-10">
        <div className="flex items-center gap-3 text-stone-500">
          <ImageIcon size={18} />
          <span className="text-sm">Image placeholder</span>
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell widget={widget}>
      <figure className="overflow-hidden rounded-[1.5rem]">
        <img src={widget.props.src} alt={widget.props.alt || ''} className="h-full w-full object-cover" />
        {widget.props?.caption ? (
          <figcaption className="mt-3 text-sm text-stone-500">{widget.props.caption}</figcaption>
        ) : null}
      </figure>
    </WidgetShell>
  );
}

function VideoWidgetRenderer({ widget }) {
  if (!widget.props?.src) {
    return (
      <WidgetShell widget={widget} className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-100/80 p-10">
        <div className="flex items-center gap-3 text-stone-500">
          <PlayCircle size={18} />
          <span className="text-sm">Video placeholder</span>
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell widget={widget}>
      <figure className="overflow-hidden rounded-[1.5rem] bg-stone-900">
        <video controls poster={widget.props?.poster || undefined} className="h-full w-full">
          <source src={widget.props.src} />
        </video>
        {widget.props?.caption ? (
          <figcaption className="p-4 text-sm text-stone-300">{widget.props.caption}</figcaption>
        ) : null}
      </figure>
    </WidgetShell>
  );
}

function ProductCardWidgetRenderer({ widget }) {
  return (
    <WidgetShell widget={widget} scope="card" className="h-full">
      <article className="flex h-full flex-col gap-4 rounded-[1.5rem] p-5">
        {widget.props?.image ? (
          <img src={widget.props.image} alt={widget.props?.title || ''} className="aspect-[4/5] w-full rounded-[1rem] object-cover" />
        ) : (
          <div className="aspect-[4/5] rounded-[1rem] bg-stone-100" />
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-stone-900">{widget.props?.title}</h3>
          <p className="text-sm text-stone-500">{widget.props?.price}</p>
        </div>
      </article>
    </WidgetShell>
  );
}

function CategoryCardWidgetRenderer({ widget }) {
  return (
    <WidgetShell widget={widget} scope="card" className="h-full">
      <article className="flex h-full flex-col gap-4 rounded-[1.5rem] p-5">
        {widget.props?.image ? (
          <img src={widget.props.image} alt={widget.props?.title || ''} className="aspect-[16/10] w-full rounded-[1rem] object-cover" />
        ) : (
          <div className="aspect-[16/10] rounded-[1rem] bg-stone-100" />
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-stone-900">{widget.props?.title}</h3>
          <p className="text-sm text-stone-500">{widget.props?.description}</p>
        </div>
      </article>
    </WidgetShell>
  );
}

function SpacerWidgetRenderer({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div style={{ height: widget.props?.height || '2rem' }} />
    </WidgetShell>
  );
}

function DividerWidgetRenderer({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div style={{ borderTop: `${widget.props?.thickness || '1px'} solid ${widget.props?.color || 'rgba(28, 25, 23, 0.12)'}` }} />
    </WidgetShell>
  );
}

function IconWidgetRenderer({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div className="inline-flex items-center gap-2 text-stone-700">
        <Star size={16} />
        <span className="text-sm font-medium">{widget.props?.label || widget.props?.icon || 'Icon'}</span>
      </div>
    </WidgetShell>
  );
}

function TestimonialWidgetRenderer({ widget }) {
  return (
    <WidgetShell widget={widget} scope="card">
      <article className="flex h-full flex-col gap-4 rounded-[1.5rem] p-6">
        <p className="text-lg leading-8 text-stone-700">"{widget.props?.quote}"</p>
        <div className="mt-auto">
          <p className="font-semibold text-stone-900">{widget.props?.author}</p>
          <p className="text-sm text-stone-500">{widget.props?.role}</p>
        </div>
      </article>
    </WidgetShell>
  );
}

function FAQWidgetRenderer({ widget }) {
  const items = Array.isArray(widget.props?.items) ? widget.props.items : [];
  return (
    <WidgetShell widget={widget}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <details key={`${widget.id}-${index}`} className="rounded-[1.25rem] border border-stone-200 bg-white px-5 py-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-stone-900">{item.question}</summary>
            <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </WidgetShell>
  );
}

function ProductShowcaseWidgetRenderer({ widget }) {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const limit = widget.props?.limit || 4;
  const categoryId = widget.props?.categoryId || '';

  React.useEffect(() => {
    const params = new URLSearchParams();
    params.set('limit', limit);
    if (categoryId) params.set('categoryId', categoryId);
    fetch(`http://localhost:5001/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.products || data.items || []);
        setProducts(items.slice(0, limit));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit, categoryId]);

  return (
    <WidgetShell widget={widget} scope="card">
      <div className="space-y-4">
        {widget.props?.heading && (
          <h2 className="font-display text-3xl text-stone-900">{widget.props.heading}</h2>
        )}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[1rem] bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">Aucun produit trouvé.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => (
              <a key={p.id || p.slug} href={`/shop/${p.slug}`} className="group flex flex-col gap-3">
                {p.images?.[0] || p.image ? (
                  <img
                    src={p.images?.[0]?.url || p.images?.[0] || p.image}
                    alt={p.name || p.title}
                    className="aspect-[4/5] w-full rounded-[1rem] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="aspect-[4/5] rounded-[1rem] bg-stone-100" />
                )}
                <div>
                  <p className="text-sm font-semibold text-stone-900 truncate">{p.name || p.title}</p>
                  <p className="text-xs text-stone-500">{p.price ? `${p.price} MAD` : ''}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}

function CategoryGridWidgetRenderer({ widget }) {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5001/api/categories')
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.categories || []);
        setCategories(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <WidgetShell widget={widget} scope="card">
      <div className="space-y-4">
        {widget.props?.heading && (
          <h2 className="font-display text-3xl text-stone-900">{widget.props.heading}</h2>
        )}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="aspect-[16/10] rounded-[1rem] bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">Aucune catégorie trouvée.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(c => (
              <a key={c.id || c.slug} href={`/shop?category=${c.slug}`} className="group relative overflow-hidden rounded-[1rem] aspect-[16/10] bg-stone-100">
                {(c.image || c.coverImage) && (
                  <img
                    src={c.image || c.coverImage}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-semibold text-sm">{c.name}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}

/* ── Registry ─────────────────────────────────────────────────── */

const COMPONENTS = {
  HeadingWidget: HeadingWidgetRenderer,
  ParagraphWidget: ParagraphWidgetRenderer,
  ButtonWidget: ButtonWidgetRenderer,
  ImageWidget: ImageWidgetRenderer,
  VideoWidget: VideoWidgetRenderer,
  ProductCardWidget: ProductCardWidgetRenderer,
  CategoryCardWidget: CategoryCardWidgetRenderer,
  SpacerWidget: SpacerWidgetRenderer,
  DividerWidget: DividerWidgetRenderer,
  IconWidget: IconWidgetRenderer,
  TestimonialWidget: TestimonialWidgetRenderer,
  FAQWidget: FAQWidgetRenderer,
  ProductShowcaseWidget: ProductShowcaseWidgetRenderer,
  CategoryGridWidget: CategoryGridWidgetRenderer,
};

export const WIDGET_REGISTRY = Object.fromEntries(
  Object.entries(WIDGET_DEFINITIONS).map(([type, definition]) => [
    type,
    {
      ...definition,
      renderer: COMPONENTS[type],
    },
  ]),
);

// Data-fetching widgets (not in shared WIDGET_DEFINITIONS, defined only in frontend)
WIDGET_REGISTRY['ProductShowcaseWidget'] = {
  type: 'ProductShowcaseWidget',
  label: 'Product Showcase',
  renderer: ProductShowcaseWidgetRenderer,
  fields: [
    { name: 'heading', label: 'Heading', type: 'text' },
    { name: 'limit', label: 'Number of products', type: 'text' },
    { name: 'categoryId', label: 'Category filter (ID)', type: 'text' },
  ],
  defaultProps: { heading: '', limit: 4, categoryId: '' },
};
WIDGET_REGISTRY['CategoryGridWidget'] = {
  type: 'CategoryGridWidget',
  label: 'Category Grid',
  renderer: CategoryGridWidgetRenderer,
  fields: [
    { name: 'heading', label: 'Heading', type: 'text' },
  ],
  defaultProps: { heading: '' },
};

export { WIDGET_TYPES, getWidgetDefinition };

export function getWidgetDef(type) {
  return WIDGET_REGISTRY[type] || null;
}

export function renderWidget(widget) {
  const definition = getWidgetDef(widget.type);
  if (!definition?.renderer) {
    console.warn(`[WidgetRegistry] No renderer for widget type: ${widget.type}`);
    return null;
  }

  const Renderer = definition.renderer;
  return <Renderer widget={widget} />;
}

/**
 * Render a widget tree (array of widgets) with optional GSAP stagger.
 * Used by section renderers that want collective animation.
 */
export function renderWidgetTree(widgetTree = [], { stagger = false, staggerConfig = {} } = {}) {
  if (!Array.isArray(widgetTree)) return null;

  const widgets = widgetTree.map((widget) => (
    <div key={widget.id} data-stagger-item={stagger ? '' : undefined}>
      {renderWidget(widget)}
    </div>
  ));

  return widgets;
}

/**
 * Hook version: returns a ref and renders a widget tree with GSAP stagger reveal.
 */
export function useWidgetTreeStagger(widgetTree = [], animationConfig = {}) {
  const containerRef = useRef(null);
  useGSAPStaggerReveal(containerRef, animationConfig, '[data-stagger-item]', [widgetTree]);
  return containerRef;
}
