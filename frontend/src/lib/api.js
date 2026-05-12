const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const AUTH_STORAGE_KEY = 'somacan-auth';
export const ADMIN_STORAGE_KEY = 'somacan-admin-key';

function getAuthToken() {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || 'null')?.token || null;
  } catch {
    return null;
  }
}

function getAdminKey() {
  try {
    return window.localStorage.getItem(ADMIN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return response.json();
}

export function getProducts(query = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== false) {
      params.set(key, String(value));
    }
  });

  const suffix = params.toString() ? `?${params.toString()}` : '';
  return request(`/products${suffix}`);
}

export function submitContactForm(payload) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getProduct(slug) {
  return request(`/products/${slug}`);
}

export function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCheckoutConfig() {
  return request('/checkout/config');
}

export function getCheckoutQuote(payload) {
  return request('/checkout/quote', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginAdmin(payload) {
  return request('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request('/auth/me');
}

export function updateProfile(payload) {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function updatePassword(payload) {
  return request('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function requestPasswordReset(payload) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getClaimOrderAccount(token) {
  return request(`/auth/claim-order-account/${token}`);
}

export function claimOrderAccount(payload) {
  return request('/auth/claim-order-account', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMyOrders() {
  return request('/orders/mine');
}

export function getGuestOrder(id, token) {
  return request(`/orders/guest/${id}?token=${encodeURIComponent(token)}`);
}

async function adminRequest(path, options = {}) {
  const adminKey = getAdminKey();
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(adminKey ? { 'x-admin-key': adminKey } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Admin API request failed: ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json();
}

export function getAdminEmailSettings() {
  return adminRequest('/admin/settings/email');
}

export function updateAdminEmailSettings(payload) {
  return adminRequest('/admin/settings/email', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function testAdminEmailSettings() {
  return adminRequest('/admin/settings/email/test', { method: 'POST' });
}

export function getAdminShippingSettings() {
  return adminRequest('/admin/settings/shipping');
}

export function updateAdminShippingSettings(payload) {
  return adminRequest('/admin/settings/shipping', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getAdminCoupons() {
  return adminRequest('/admin/coupons');
}

export function createAdminCoupon(payload) {
  return adminRequest('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminCoupon(id, payload) {
  return adminRequest(`/admin/coupons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getAdminOrders() {
  return adminRequest('/admin/orders');
}

export function updateAdminOrder(id, payload) {
  return adminRequest(`/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getAdminCategories() {
  return adminRequest('/admin/categories');
}

export function createAdminCategory(payload) {
  return adminRequest('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminCategory(id, payload) {
  return adminRequest(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getAdminProducts() {
  return adminRequest('/admin/products');
}

export function createAdminProduct(payload) {
  return adminRequest('/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminProduct(id, payload) {
  return adminRequest(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id) {
  return adminRequest(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export function getAdminContent() {
  return adminRequest('/admin/content');
}

export function createAdminContent(payload) {
  return adminRequest('/admin/content', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminContent(id, payload) {
  return adminRequest(`/admin/content/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function uploadAdminImage(file) {
  return uploadMedia(file, { title: file.name });
}

export function getAdminContactSubmissions() {
  return adminRequest('/admin/forms/contact-submissions');
}

export function updateAdminContactSubmission(id, payload) {
  return adminRequest(`/admin/forms/contact-submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// --- Newsletter (public) ---
export function subscribeNewsletter(payload) {
  return request('/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getPopupConfig() {
  return request('/newsletter/popup');
}

// --- Newsletter + Popup (admin) ---
export function getAdminNewsletterSubscribers() {
  return adminRequest('/admin/newsletter/subscribers');
}

export function updateAdminNewsletterSubscriber(id, payload) {
  return adminRequest(`/admin/newsletter/subscribers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteAdminNewsletterSubscriber(id) {
  return adminRequest(`/admin/newsletter/subscribers/${id}`, { method: 'DELETE' });
}

export function getAdminPopupConfig() {
  return adminRequest('/admin/popup');
}

export function updateAdminPopupConfig(payload) {
  return adminRequest('/admin/popup', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// --- Categories (public) ---
export function getCategories() {
  return request('/categories');
}

// --- Pages (public) ---

export function getPages() {
  return request('/pages');
}

export function getPageBySlug(slug) {
  return request(`/pages/${encodeURIComponent(slug)}`);
}

export function getPageStyle(pageKey) {
  return request(`/page-styles/${encodeURIComponent(pageKey)}`);
}

// --- Pages (admin) ---

export function createPage(data) {
  return adminRequest('/pages/admin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePage(id, data) {
  return adminRequest(`/pages/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePage(id) {
  return adminRequest(`/pages/admin/${id}`, {
    method: 'DELETE',
  });
}

export function getAdminPageStyle(pageKey) {
  return adminRequest(`/page-styles/admin/${encodeURIComponent(pageKey)}`);
}

export function updateAdminPageStyle(pageKey, styles) {
  return adminRequest(`/page-styles/admin/${encodeURIComponent(pageKey)}`, {
    method: 'PUT',
    body: JSON.stringify({ styles }),
  });
}

// --- Menus (public) ---

export function getMenu(name) {
  return request(`/menus/${encodeURIComponent(name)}`);
}

// --- Menus (admin) ---

export function getMenus() {
  return adminRequest('/menus/admin/all');
}

export function createMenu(data) {
  return adminRequest('/menus/admin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateMenu(id, data) {
  return adminRequest(`/menus/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteMenu(id) {
  return adminRequest(`/menus/admin/${id}`, {
    method: 'DELETE',
  });
}

// --- Content / Sections (admin) ---

export function getSectionsByPage(pageKey) {
  return adminRequest(`/admin/content/${encodeURIComponent(pageKey)}`);
}

export function deleteSection(id) {
  return adminRequest(`/admin/content/${id}`, {
    method: 'DELETE',
  });
}

export function reorderSections(items) {
  return adminRequest('/admin/content/reorder', {
    method: 'PATCH',
    body: JSON.stringify(items),
  });
}

// ─── Page Sections (new CMS) ─────────────────────────────────

export function getPageSections(pageSlug) {
  return adminRequest(`/admin/page-sections?pageSlug=${encodeURIComponent(pageSlug)}`);
}

export function createPageSection(payload) {
  return adminRequest('/admin/page-sections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePageSection(id, payload) {
  return adminRequest(`/admin/page-sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deletePageSection(id) {
  return adminRequest(`/admin/page-sections/${id}`, {
    method: 'DELETE',
  });
}

export function duplicatePageSection(id) {
  return adminRequest(`/admin/page-sections/${id}/duplicate`, {
    method: 'POST',
  });
}

export function reorderPageSections(items) {
  return adminRequest('/admin/page-sections/reorder', {
    method: 'POST',
    body: JSON.stringify(items),
  });
}

export function togglePageSection(id) {
  return adminRequest(`/admin/page-sections/${id}/toggle`, {
    method: 'PATCH',
  });
}

export function getAdminPages() {
  return adminRequest('/admin/pages/list');
}

export function createAdminPage(payload) {
  return adminRequest('/admin/pages/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminPage(id, payload) {
  return adminRequest(`/admin/pages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// ─── Theme Settings ─────────────────────────────────────────────
export function getThemeSettings() {
  return request('/theme');
}

export function updateThemeSettings(payload) {
  return adminRequest('/admin/theme', { method: 'PUT', body: JSON.stringify(payload) });
}

// ─── Header Settings ─────────────────────────────────────────────
export function getHeaderSettings() {
  return request('/header');
}
export function getAdminHeaderSettings() {
  return adminRequest('/admin/header');
}
export function updateAdminHeaderSettings(payload) {
  return adminRequest('/admin/header', { method: 'PUT', body: JSON.stringify(payload) });
}

// ─── Footer Settings ─────────────────────────────────────────────
export function getFooterSettings() {
  return request('/footer');
}
export function getAdminFooterSettings() {
  return adminRequest('/admin/footer');
}
export function updateAdminFooterSettings(payload) {
  return adminRequest('/admin/footer', { method: 'PUT', body: JSON.stringify(payload) });
}

// ─── Media Library ─────────────────────────────────────────────
export function getMediaLibrary(query = {}) {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.folder) params.set('folder', query.folder);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return adminRequest(`/media${suffix}`);
}

export function uploadMedia(file, meta = {}) {
  const formData = new FormData();
  formData.append('file', file);
  if (meta.altText) formData.append('altText', meta.altText);
  if (meta.title) formData.append('title', meta.title);
  if (meta.folder) formData.append('folder', meta.folder);
  return adminRequest('/media/upload', { method: 'POST', body: formData });
}

export function updateMedia(id, payload) {
  return adminRequest(`/media/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function deleteMedia(id) {
  return adminRequest(`/media/${id}`, { method: 'DELETE' });
}

// ─── Menu Items ─────────────────────────────────────────────────
export function getMenuItems(menuId) {
  return adminRequest(`/menu-items?menuId=${menuId}`);
}

export function createMenuItem(payload) {
  return adminRequest('/menu-items', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateMenuItem(id, payload) {
  return adminRequest(`/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteMenuItem(id) {
  return adminRequest(`/menu-items/${id}`, { method: 'DELETE' });
}

export { API_BASE_URL };
