const assetModules = import.meta.glob('../public/asset/*', {
  eager: true,
  import: 'default',
});

const assetUrlMap = new Map();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');

for (const [modulePath, resolvedUrl] of Object.entries(assetModules)) {
  const filename = modulePath.split('/').pop();
  if (!filename) continue;

  const assetPath = `/asset/${filename}`;
  assetUrlMap.set(assetPath, resolvedUrl);
  assetUrlMap.set(decodeURIComponent(assetPath), resolvedUrl);
  assetUrlMap.set(assetPath.normalize('NFC'), resolvedUrl);
  assetUrlMap.set(assetPath.normalize('NFD'), resolvedUrl);
  assetUrlMap.set(decodeURIComponent(assetPath).normalize('NFC'), resolvedUrl);
  assetUrlMap.set(decodeURIComponent(assetPath).normalize('NFD'), resolvedUrl);
}

export function resolveCmsAssetUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return value;

  if (/^(?:https?:)?\/\//.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  // Normalize /public/asset/ → /asset/ (DB stores the backend path)
  const normalized = value.startsWith('/public/asset/')
    ? value.replace('/public/asset/', '/asset/')
    : value;

  if (normalized.startsWith('/asset/')) {
    const decoded = decodeURIComponent(normalized);

    return (
      assetUrlMap.get(normalized) ||
      assetUrlMap.get(decoded) ||
      assetUrlMap.get(normalized.normalize('NFC')) ||
      assetUrlMap.get(normalized.normalize('NFD')) ||
      assetUrlMap.get(decoded.normalize('NFC')) ||
      assetUrlMap.get(decoded.normalize('NFD')) ||
      normalized
    );
  }

  if (normalized.startsWith('/public/')) {
    return `${backendOrigin}${normalized}`;
  }

  if (normalized.startsWith('/uploads/')) {
    return `${backendOrigin}/public${normalized}`;
  }

  return value;
}
