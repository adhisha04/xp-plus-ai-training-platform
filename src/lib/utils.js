// src/lib/utils.js

// Tailwind + conditional class helper
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Route helper
export function createPageUrl(path) {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path;
}
