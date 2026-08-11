'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/users', label: 'Utenti' },
  { href: '/dashboard/list-categories', label: 'Categorie liste' },
  { href: '/dashboard/tags', label: 'Tag' },
  { href: '/dashboard/notifications', label: 'Notifiche' },
  { href: '/dashboard/memberships', label: 'Membership' },
  { href: '/dashboard/reports', label: 'Segnalazioni' },
  { href: '/dashboard/payments', label: 'Pagamenti' },
];

// Sidebar fissa, desktop-first (architecture.md: web/ ha sempre layout a sidebar, mai bottom tabs come mobile).
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col gap-1 border-r border-border bg-foreground p-4">
      <p className="mb-4 px-2 text-lg font-semibold text-text-color">Randomix Admin</p>
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm ${
              isActive ? 'bg-primary text-white' : 'text-text-color hover:bg-background'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
