import React from 'react';
import AnimatedSection from '../../cms/AnimatedSection';
import Hero from '../../sections/Hero';
import WheelHero from '../../sections/WheelHero';
import BrandMarquee from '../../sections/BrandMarquee';
import CategorySection from '../../sections/CategorySection';
import ProductsShowcase from '../../sections/ProductsShowcase';
import StatsSection from '../../sections/StatsSection';
import SplitHeroSection from '../../sections/SplitHeroSection';
import ExpertiseSection from '../../sections/ExpertiseSection';
import OfferSection from '../../sections/OfferSection';
import TestimonialsSection from '../../sections/TestimonialsSection';
import BlogPreview from '../../sections/BlogPreview';
import FaqSection from '../../sections/FaqSection';
import ContactHero from '../../sections/ContactHero';
import ContactForm from '../../sections/ContactForm';
import ContactMap from '../../sections/ContactMap';
import ContactFAQ from '../../sections/ContactFAQ';
import ShopHero from '../../sections/ShopHero';
import ShopGrid from '../../sections/ShopGrid';
import AboutHero from '../../sections/AboutHero';
import AboutPrinciples from '../../sections/AboutPrinciples';
import AboutManifeste from '../../sections/AboutManifeste';
import AboutMethod from '../../sections/AboutMethod';
import AboutTimeline from '../../sections/AboutTimeline';
import AboutEngagement from '../../sections/AboutEngagement';
import BlogHero from '../../sections/BlogHero';
import BlogGrid from '../../sections/BlogGrid';
import ArticleEditorialNote from '../../sections/ArticleEditorialNote';
import ProductRelated from '../../sections/ProductRelated';
import NewsletterSection from '../../sections/NewsletterSection';
import FeaturesBar from '../../sections/FeaturesBar';
import StorySection from '../../sections/StorySection';
import WidgetSectionRenderer from './WidgetSectionRenderer';
import { isWidgetSectionType } from '../../../../shared/cms/sections.js';
import { getVisibilityClasses, getResponsiveInlineStyle, normalizeResponsiveConfig } from '../../cms/v2/ResponsiveEngine';

const SECTION_COMPONENTS = {
  Hero,
  WheelHero,
  ContactHero,
  ContactForm,
  ContactMap,
  ContactFAQ,
  ShopHero,
  ShopGrid,
  AboutHero,
  AboutPrinciples,
  AboutManifeste,
  AboutMethod,
  AboutTimeline,
  AboutEngagement,
  BlogHero,
  BlogGrid,
  ArticleEditorialNote,
  ProductRelated,
  BrandMarquee,
  CategorySection,
  ProductsShowcase,
  StatsSection,
  SplitHeroSection,
  ExpertiseSection,
  OfferSection,
  TestimonialsSection,
  BlogPreview,
  FaqSection,
  NewsletterSection,
  FeaturesBar,
  StorySection,
};

/**
 * Renders a CMS section based on its data.
 * Supports both old SiteContent format (contentType, content.type, cssClasses, animation string)
 * and new PageSection format (section.type, section.content, section.settings, section.animation object, section.responsive)
 */
export default function SectionRenderer({ section }) {
  // Detect format: old format has 'contentType' field, new format has 'type' directly
  const isNewFormat = section.type && !section.contentType;

  if (isNewFormat) {
    return renderNewFormat(section);
  } else {
    return renderOldFormat(section);
  }
}

/**
 * Renders new PageSection format
 * - section.type: string (e.g. 'Hero', 'CategorySection')
 * - section.content: JSON object (props to spread into component)
 * - section.settings: JSON object (wrapper style: backgroundColor, etc.)
 * - section.animation: JSON object ({ type, duration, delay, easing, stagger, triggerOnScroll })
 * - section.responsive: JSON object ({ desktop, tablet, mobile } each with padding, visible)
 * - section.isActive: boolean
 */
function renderNewFormat(section) {
  const { type, content = {}, settings = {}, responsive = {}, isActive = true } = section;

  // If section is not active, don't render
  if (!isActive) {
    return null;
  }

  if (isWidgetSectionType(type)) {
    return <WidgetSectionRenderer section={section} />;
  }

  const Component = SECTION_COMPONENTS[type];

  if (!Component) {
    console.warn(`No component found for section type: ${type}`);
    return null;
  }

  // Build wrapper style from settings
  const wrapperStyle = {
    ...(settings.backgroundColor && { backgroundColor: settings.backgroundColor }),
  };
  const contentWidth = settings.contentWidth || '';
  const isFullWidth = settings.fullWidth === true;

  // Handle responsive visibility: if mobile is hidden, add tailwind classes
  const normalizedResponsive = normalizeResponsiveConfig(responsive);
  const classNames = ['cms-section', getVisibilityClasses(normalizedResponsive)].filter(Boolean).join(' ');

  // Apply responsive padding if available
  const responsiveStyle = getResponsiveInlineStyle(normalizedResponsive);

  const finalStyle = {
    ...wrapperStyle,
    ...responsiveStyle,
  };

  return (
    <AnimatedSection
      animation={section.animation}
      className={classNames}
      style={finalStyle}
      dataTheme={content.theme || 'light'}
    >
      <div
        style={{
          width: '100%',
          maxWidth: !isFullWidth && contentWidth ? contentWidth : undefined,
          margin: !isFullWidth && contentWidth ? '0 auto' : undefined,
        }}
      >
        <Component {...content} settings={settings} />
      </div>
    </AnimatedSection>
  );
}

/**
 * Renders old SiteContent format (backward compatibility)
 * - section.contentType: string
 * - section.content: { type, ...props }
 * - section.cssClasses: string
 * - section.animation: string (animation name or empty)
 * - section.animationDelay: number or string
 */
function renderOldFormat(section) {
  const { contentType, content, animation, animationDelay, cssClasses } = section;
  const { type, ...props } = content;
  const wrapperStyle = typeof props.style === 'object' && props.style ? props.style : {};
  const sectionScopeClass = `cms-section-${section.id}`;
  const mergedClassName = [
    'cms-section',
    sectionScopeClass,
    cssClasses,
    wrapperStyle.customClasses,
  ].filter(Boolean).join(' ');
  const { customCss, customClasses, ...safeWrapperStyle } = wrapperStyle;

  const Component = SECTION_COMPONENTS[type];

  if (!Component) {
    console.warn(`No component found for section type: ${type}`);
    return null;
  }

  const scopedCss = typeof customCss === 'string' && customCss.trim()
    ? (customCss.includes('&')
      ? customCss.replaceAll('&', `.${sectionScopeClass}`)
      : `.${sectionScopeClass} { ${customCss} }`)
    : '';

  return (
    <div
      className={mergedClassName}
      data-theme={props.theme || 'light'}
      data-section-key={section.sectionKey}
      style={safeWrapperStyle}
    >
      {scopedCss ? <style>{scopedCss}</style> : null}
      <Component {...props} />
    </div>
  );
}
