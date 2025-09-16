import { useMemo } from 'react';

// Custom hook untuk asset path
export const useAssetPath = (path: string) => {
  return useMemo(() => {
    const base = import.meta.env.BASE_URL || '/';
    
    if (path.startsWith('http')) return path;
    if (path.startsWith(base)) return path;
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${cleanPath}`;
  }, [path]);
};

// Usage dalam component:
// const logoPath = useAssetPath('/img/logo-lsp.svg');
// <img src={logoPath} />