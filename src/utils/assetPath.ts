// Helper function untuk asset path
export const getAssetPath = (path: string) => {
  // Di development, base adalah '/'
  // Di production dengan subfolder, base adalah '/twodev/'
  const base = import.meta.env.BASE_URL || '/';
  
  // Jika path sudah absolute (dimulai dengan http), return as is
  if (path.startsWith('http')) return path;
  
  // Jika path sudah include base, return as is
  if (path.startsWith(base)) return path;
  
  // Remove leading slash jika ada, lalu gabung dengan base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

// Usage:
// <img src={getAssetPath('/img/logo-lsp.svg')} />
// <img src={getAssetPath('img/logo-lsp.svg')} />