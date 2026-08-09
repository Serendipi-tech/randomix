import type { ComponentType } from 'react';
import * as LucideIcons from 'lucide-react';

type IconComponent = ComponentType<{ size?: number; color?: string }>;

/** Risolve un nome export PascalCase (es. "BookSearch") sul componente Lucide corrispondente, se esiste. */
export function getLucideIcon(name: string): IconComponent | undefined {
  const icon = (LucideIcons as unknown as Record<string, IconComponent>)[name];
  return typeof icon === 'function' || (typeof icon === 'object' && icon !== null) ? icon : undefined;
}

/** kebab-case (slug, es. "book-search") -> PascalCase (es. "BookSearch"), formato export di lucide-react. */
export function slugToPascalCase(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
