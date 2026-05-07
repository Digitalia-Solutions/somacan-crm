const assetModules = import.meta.glob('../public/asset/*', {
  eager: true,
  import: 'default',
});

const assetUrlMap = new Map();

for (const [modulePath, resolvedUrl] of Object.entries(assetModules)) {
  const filename = modulePath.split('/').pop();
  if (!filename) continue;

  const assetPath = `/asset/${filename}`;
  assetUrlMap.set(assetPath, resolvedUrl);
  assetUrlMap.set(decodeURIComponent(assetPath), resolvedUrl);
}

export function resolveCmsAssetUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return value;

  // Normalize /public/asset/ → /asset/ (DB stores the backend path)
  const normalized = value.startsWith('/public/asset/')
    ? value.replace('/public/asset/', '/asset/')
    : value;

  if (!normalized.startsWith('/asset/')) return value;

  return assetUrlMap.get(normalized) || assetUrlMap.get(decodeURIComponent(normalized)) || normalized;
}
