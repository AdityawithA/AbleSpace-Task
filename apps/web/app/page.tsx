'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name to continue.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { accessToken, user } = await api.guestLogin(name.trim());
      saveSession(accessToken, user);
      router.push('/board');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div
        className="w-full max-w-sm rounded-xl border p-8 shadow-sm"
        style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))' }}
      >
        <h1 className="mb-1 text-xl font-semibold">AbleSpace Tasks</h1>
        <p className="mb-6 text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
          Continue as a guest to start managing tasks.
        </p>

        <form onSubmit={handleGuestLogin} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Your name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Continue as Guest'}
          </Button>
        </form>
      </div>
    </main>
  );
}
