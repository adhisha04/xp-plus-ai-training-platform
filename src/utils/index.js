export function createPageUrl(path) {
  // Temporary compatibility with Base44
  return path === 'Home' ? '/' : `/${path.toLowerCase()}`;
}
