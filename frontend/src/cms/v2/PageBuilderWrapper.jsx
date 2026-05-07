/**
 * PageBuilderWrapper.jsx
 *
 * Wraps PageBuilder2 with CmsPageProvider for live preview architecture.
 * This is the integration layer between the new V2 context and the existing builder.
 *
 * Usage:
 *   <PageBuilderWrapper />
 */

import React, { useCallback } from 'react';
import { CmsPageProvider } from './CmsPageContext';
import PageBuilder2 from '../../components/admin/PageBuilder2';

export default function PageBuilderWrapper() {
  // In a real app, these would be API calls
  const handleSavePage = useCallback(async (pagePatch) => {
    // TODO: wire to updateAdminPage API
    console.log('[PageBuilderWrapper] savePage', pagePatch);
    return pagePatch;
  }, []);

  const handleSaveSection = useCallback(async (sectionId, sectionPatch) => {
    // TODO: wire to updatePageSection API
    console.log('[PageBuilderWrapper] saveSection', sectionId, sectionPatch);
    return { id: sectionId, ...sectionPatch };
  }, []);

  return (
    <CmsPageProvider onSavePage={handleSavePage} onSaveSection={handleSaveSection}>
      <PageBuilder2 />
    </CmsPageProvider>
  );
}
