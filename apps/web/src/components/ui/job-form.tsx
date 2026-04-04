'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const jobFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  department: z.string().min(2),
  location: z.string().min(2),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']),
  description: z.string().min(20),
  requirements: z.string().min(3),
  isActive: z.boolean().default(true),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  defaultValues?: Partial<JobFormValues>;
  submitLabel: string;
  onSubmit: (values: JobFormValues) => Promise<void>;
}

export function JobForm({ defaultValues, submitLabel, onSubmit }: JobFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      department: defaultValues?.department ?? '',
      location: defaultValues?.location ?? '',
      type: defaultValues?.type ?? 'FULL_TIME',
      description: defaultValues?.description ?? '',
      requirements: defaultValues?.requirements ?? '',
      isActive: defaultValues?.isActive ?? true,
    },
  });

  return (
    <form className="glass-card rounded-2xl p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Title</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            {...register('title')}
          />
          {errors.title ? <p className="mt-1 text-xs text-red-300">{errors.title.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Department</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            {...register('department')}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Location</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            {...register('location')}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Type</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
            {...register('type')}
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">Description</label>
        <textarea
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
          {...register('description')}
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">
          Requirements (comma separated)
        </label>
        <input
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
          {...register('requirements')}
        />
      </div>

      <div className="mt-4">
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" {...register('isActive')} /> Active (visible on public jobs page)
        </label>
        <p className="mt-1 text-xs text-zinc-500">Inactive jobs are visible in admin only.</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="gradient-button mt-6 rounded-full px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
