'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionUser, clearSession } from '@/lib/auth';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      router.replace('/');
      return;
    }
    setUser(sessionUser);
    setChecked(true);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.replace('/');
  };

  if (!checked) return null; // avoid flashing content before auth check

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 sm:px-6"
        style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))' }}
      >
        <div>
          <h1 className="text-sm font-semibold sm:text-base">AbleSpace Tasks</h1>
          <p className="text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
            Signed in as {user?.name} (Guest)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="secondary" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
