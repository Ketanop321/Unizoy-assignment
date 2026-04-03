'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/lib/api/endpoints';
import { useToastStore } from '@/lib/store/toast-store';

const applySchema = z.object({
  candidateName: z.string().min(2, 'Name is required'),
  candidateEmail: z.string().email('Valid email required'),
  resumeLink: z.string().url('Valid URL required'),
  coverNote: z.string().max(2000).optional(),
});

type ApplyValues = z.infer<typeof applySchema>;

export default function ApplyPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const [submitted, setSubmitted] = useState(false);
  const pushToast = useToastStore((state) => state.push);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
  });

  const applyMutation = useMutation({
    mutationFn: (payload: ApplyValues) => api.applyToJob(jobId, payload),
    onSuccess: () => {
      setSubmitted(true);
      pushToast({
        title: 'Application submitted',
        description: 'Your profile has been shared with the hiring team.',
        variant: 'success',
      });
    },
    onError: () => {
      pushToast({
        title: 'Unable to submit application',
        description: 'Please verify details and try again.',
        variant: 'error',
      });
    },
  });

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-8">
        <div className="glass-card rounded-2xl p-10 text-center">
          <CheckCircle2 className="mx-auto text-emerald-400" size={52} />
          <h1 className="mt-4 text-2xl font-bold">Application Sent</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Thanks for applying. The Unizoy team will review your profile and reach out soon.
          </p>
          <Link href="/jobs" className="gradient-button mt-6 inline-flex rounded-full px-6 py-2 text-sm font-semibold text-white">
            Explore More Roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-8">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Candidate Application</p>
        <h1 className="mt-2 text-2xl font-bold">Apply For This Role</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => applyMutation.mutate(values))}>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Full Name</label>
            <input
              {...register('candidateName')}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
              placeholder="Your full name"
            />
            {errors.candidateName ? <p className="mt-1 text-xs text-red-300">{errors.candidateName.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Email</label>
            <input
              {...register('candidateEmail')}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
            {errors.candidateEmail ? <p className="mt-1 text-xs text-red-300">{errors.candidateEmail.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Resume Link</label>
            <input
              {...register('resumeLink')}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
              placeholder="https://..."
            />
            {errors.resumeLink ? <p className="mt-1 text-xs text-red-300">{errors.resumeLink.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Cover Note (Optional)</label>
            <textarea
              {...register('coverNote')}
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
              placeholder="Tell us why you are a good fit"
            />
          </div>

          <button
            type="submit"
            disabled={applyMutation.isPending}
            className="gradient-button rounded-full px-6 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
