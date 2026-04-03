'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { JobForm, type JobFormValues } from '@/components/ui/job-form';
import { api } from '@/lib/api/endpoints';
import { useToastStore } from '@/lib/store/toast-store';

export default function NewJobPage(): JSX.Element {
  const router = useRouter();
  const pushToast = useToastStore((state) => state.push);

  const createMutation = useMutation({
    mutationFn: (values: JobFormValues) =>
      api.createJob({
        title: values.title,
        department: values.department,
        location: values.location,
        type: values.type,
        description: values.description,
        requirements: values.requirements.split(',').map((value) => value.trim()).filter(Boolean),
        isActive: values.isActive,
      }),
    onSuccess: () => {
      pushToast({ title: 'Job created successfully', variant: 'success' });
      router.push('/admin/jobs');
      router.refresh();
    },
    onError: () => {
      pushToast({ title: 'Failed to create job', variant: 'error' });
    },
  });

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Admin Jobs</p>
        <h1 className="mt-2 text-3xl font-black">Create Job</h1>
      </div>

      <JobForm
        submitLabel="Create Job"
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />
    </div>
  );
}
