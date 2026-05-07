import React from 'react';
import PageRenderer from './PageRenderer';

/**
 * PreviewRenderer
 *
 * Wraps PageRenderer in a constrained preview container for the admin editor.
 * Adds a subtle chrome and scales if needed.
 */
export default function PreviewRenderer({ sections = [], page = null, onSectionClick }) {
  // Build a minimal page object if only sections are provided
  const previewPage = page || {
    template: 'custom',
    sections,
    isPublished: false,
  };

  return (
    <div className="preview-renderer">
      <PageRenderer
        page={previewPage}
        previewMode
        onSectionClick={onSectionClick}
      />
    </div>
  );
}
