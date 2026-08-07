import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard.api';
import type {
  ImportJobStep,
  ImportStatusResponse,
} from '../api/dashboard.types';
import { steps } from '../constants';

function stepIndex(step: string | undefined): number {
  if (!step) return 0;
  const idx = steps.findIndex((s) => s.match.includes(step as ImportJobStep));
  return idx >= 0 ? idx : 0;
}

export function useImportJob(jobId: string | undefined) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ImportStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDone = useCallback(
    (done: ImportStatusResponse) => {
      if (done.video_uuid) {
        navigate(`/app/videos/${done.video_uuid}`, { replace: true });
      } else {
        setError('Import zakończony, ale brak ID filmu.');
      }
    },
    [navigate],
  );

  useEffect(() => {
    if (!jobId) {
      setError('Brak ID importu.');
      return;
    }

    setError(null);
    setStatus(null);

    const es = new EventSource(dashboardApi.importEventsUrl(jobId), {
      withCredentials: true,
    });

    const handleStatus = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as ImportStatusResponse;
        setStatus(data);

        if (data.status === 'COMPLETED') {
          es.close();
          onDone(data);
        } else if (data.status === 'FAILED') {
          es.close();
          setError(data.error ?? 'Import nie powiódł się.');
        }
      } catch {
        setError('Nie udało się odczytać statusu importu.');
        es.close();
      }
    };

    es.addEventListener('status', handleStatus as EventListener);

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        setError('Połączenie ze statusem importu zostało przerwane.');
      }
    };

    return () => {
      es.removeEventListener('status', handleStatus as EventListener);
      es.close();
    };
  }, [jobId, onDone]);

  return {
    status,
    error,
    progress: status?.progress ?? 0,
    activeStep: stepIndex(status?.step),
    importing: !!jobId && !error && status?.status !== 'FAILED',
  };
}
