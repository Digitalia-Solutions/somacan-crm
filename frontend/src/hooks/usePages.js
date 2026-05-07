import { useEffect, useState } from 'react';
import { getPages, getPageBySlug, getSectionsByPage } from '../lib/api';

/**
 * Fetch list of published pages.
 * @returns {{ pages: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function usePages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchPages() {
    setLoading(true);
    setError(null);

    getPages()
      .then((data) => setPages(Array.isArray(data) ? data : []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    getPages()
      .then((data) => {
        if (active) setPages(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return { pages, loading, error, refetch: fetchPages };
}

/**
 * Fetch a single page + its sections by slug.
 * @param {string} slug
 * @returns {{ page: object|null, sections: Array, loading: boolean, error: Error|null }}
 */
export function usePageBySlug(slug) {
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    let active = true;

    setLoading(true);
    setError(null);

    getPageBySlug(slug)
      .then((data) => {
        if (active) {
          setPage(data);
          setSections(Array.isArray(data.sections) ? data.sections : []);
        }
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [slug]);

  return { page, sections, loading, error };
}

/**
 * Fetch page data for admin editing (loads sections by pageKey).
 * @param {string|null} pageKey
 * @returns {{ sections: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useAdminPage(pageKey) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function fetchSections() {
    if (!pageKey) return;

    setLoading(true);
    setError(null);

    getSectionsByPage(pageKey)
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!pageKey) {
      setSections([]);
      return;
    }

    let active = true;

    setLoading(true);
    setError(null);

    getSectionsByPage(pageKey)
      .then((data) => {
        if (active) setSections(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [pageKey]);

  return { sections, loading, error, refetch: fetchSections };
}
