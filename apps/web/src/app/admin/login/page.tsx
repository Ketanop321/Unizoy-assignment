'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/lib/api/endpoints';
import { useAuthStore } from '@/lib/store/auth-store';
import { useToastStore } from '@/lib/store/toast-store';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage(): JSX.Element {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const pushToast = useToastStore((state) => state.push);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@unizoy.com',
      password: 'Admin@123',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginValues) => api.login(values),
    onSuccess: (user) => {
      setUser(user);
      pushToast({ title: 'Welcome back, admin', variant: 'success' });
      router.push('/admin/dashboard');
      router.refresh();
    },
    onError: () => {
      pushToast({
        title: 'Login failed',
        description: 'Invalid credentials or missing admin permissions.',
        variant: 'error',
      });
    },
  });

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="glass-card w-full max-w-md rounded-2xl border border-white/10 p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Admin Portal</p>
        <h1 className="mt-2 text-2xl font-bold">Sign In</h1>
        <p className="mt-1 text-sm text-zinc-400">Access jobs, applications, and hiring operations.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Email</label>
            <input
              {...register('email')}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
            {errors.email ? <p className="mt-1 text-xs text-red-300">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            />
            {errors.password ? <p className="mt-1 text-xs text-red-300">{errors.password.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="gradient-button w-full rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
