'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { JobForm, type JobFormValues } from '@/components/ui/job-form';
import { api } from '@/lib/api/endpoints';
import { EmptyState } from '@/components/ui/empty-state';
import { useToastStore } from '@/lib/store/toast-store';

export default function EditJobPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pushToast = useToastStore((state) => state.push);

  const jobQuery = useQuery({
    queryKey: ['admin-job', params.id],
    queryFn: () => api.getAdminJobById(params.id),
    enabled: Boolean(params.id),
  });

  const updateMutation = useMutation({
    mutationFn: (values: JobFormValues) =>
      api.updateJob(params.id, {
        title: values.title,
        department: values.department,
        location: values.location,
        type: values.type,
        description: values.description,
        requirements: values.requirements.split(',').map((value) => value.trim()).filter(Boolean),
        isActive: values.isActive,
      }),
    onSuccess: () => {
      pushToast({ title: 'Job updated', variant: 'success' });
      router.push('/admin/jobs');
      router.refresh();
    },
    onError: () => {
      pushToast({ title: 'Unable to update job', variant: 'error' });
    },
  });

  if (jobQuery.isLoading) {
    return <div className="glass-card shimmer h-56 rounded-2xl" />;
  }

  if (!jobQuery.data) {
    return (
      <EmptyState
        title="Job not found"
        description="This role may have been removed or is unavailable."
        actionHref="/admin/jobs"
        actionLabel="Back To Jobs"
      />
    );
  }

  const job = jobQuery.data;

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Admin Jobs</p>
        <h1 className="mt-2 text-3xl font-black">Edit Job</h1>
      </div>

      <JobForm
        defaultValues={{
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          requirements: job.requirements.join(', '),
          isActive: job.isActive,
        }}
        submitLabel="Update Job"
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
        }}
      />
    </div>
  );
}
