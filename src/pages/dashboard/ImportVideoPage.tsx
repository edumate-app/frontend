import { PageHeader } from '@/app/layouts/dashboard/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { steps } from '@/features/dashboard/constants';
import { useImportJob } from '@/features/dashboard/hooks/useImportJob';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function ImportVideoPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { importing, progress, activeStep, error } = useImportJob(jobId);

  return (
    <div className="w-full max-w-7xl px-15 py-15 sm:px-6 lg:px-28 ">
      <div className="max-w-2xl space-y-5">
        <PageHeader
          title="Import filmu"
          breadcrumbs={[
            { label: 'Moje filmy' },
            { label: 'Dodaj film', href: '/app/videos/new' },
            { label: 'Import' },
          ]}
          description="Możesz odświeżyć stronę — postęp się nie zgubi."
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {error ? 'Import nie powiódł się' : 'Importujemy Twój film'}
            </CardTitle>
            <CardDescription>
              {error ? error : `Postęp: ${progress}%`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {!error ? (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.min(Math.max(progress, 2), 100)}%` }}
                />
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {steps.map((s, i) => {
                const done = importing && i < activeStep;
                const current = importing && i === activeStep;
                const Icon = done ? Check : s.icon;
                return (
                  <div
                    key={s.title}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                        done && 'bg-primary text-primary-foreground',
                        current &&
                          'bg-primary-100 text-primary-600 animate-pulse',
                        !done &&
                          !current &&
                          'bg-secondary text-muted-foreground',
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <p
                      className={cn(
                        'text-2xs leading-snug',
                        current
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground',
                      )}
                    >
                      {i + 1}. {s.title}
                    </p>
                  </div>
                );
              })}
            </div>
            {error ? (
              <Button asChild className="w-full" size="lg">
                <Link to="/app/videos/new">Spróbuj ponownie</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
