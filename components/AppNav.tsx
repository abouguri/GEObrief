'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const LINKS = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/history', label: 'History' },
  { href: '/app/settings', label: 'Settings' },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch {
      // signOut surfaces the failure through the auth context's error state
    }
  };

  return (
    <nav className="border-b border-white/10 bg-black/30 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold text-brand-accent">
          GEObrief.ai
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'text-white font-semibold text-sm sm:text-base'
                  : 'text-white/60 hover:text-white transition-colors text-sm sm:text-base'
              }
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
