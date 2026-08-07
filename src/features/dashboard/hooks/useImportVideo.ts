import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import type {
  ImportJobStep,
  ImportStatusResponse,
} from '../api/dashboard.types';
import { useNavigate } from 'react-router-dom';
import { steps } from '../constants';

function stepIndex(step: string | undefined): number {
  if (!step) return 0;
  const idx = steps.findIndex((s) => s.match.includes(step as ImportJobStep));
  return idx >= 0 ? idx : 0;
}

export const useImportVideo = () => {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<ImportStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startImport = async (url: string, targetLang: string) => {
    const response = await dashboardApi.add({
      url,
      targetLang,
    });
    setJobId(response.data.jobId);
  };

  useEffect(() => {}, [jobId]);

  const onStatus = useCallback((next: ImportStatusResponse) => {
    setStatus(next);
  }, []);

  const onDone = useCallback(
    (done: ImportStatusResponse) => {
      if (done.video_uuid) {
        navigate(`/app/videos/${done.video_uuid}`);
      } else {
        setError('Import zakończony, ale brak ID filmu.');
        setJobId(null);
      }
    },
    [navigate],
  );

  const onImportError = useCallback((message: string) => {
    setError(message);
    setJobId(null);
  }, []);

  async function handleImport(url: string, lang: string) {
    if (!url || !lang) return;

    setStarting(true);
    setError(null);
    setStatus(null);

    try {
      await startImport(url, lang);
    } catch {
      setError('Nie udało się rozpocząć importu.');
    } finally {
      setStarting(false);
    }
  }

  useEffect(() => {
    if (!jobId) return;

    const es = new EventSource(dashboardApi.importEventsUrl(jobId), {
      withCredentials: true,
    });

    const handleStatus = (event: MessageEvent<string>) => {
      console.log('Received import status event:', event);
      try {
        const data = JSON.parse(event.data) as ImportStatusResponse;
        onStatus(data);

        if (data.status === 'COMPLETED') {
          es.close();
          onDone(data);
        } else if (data.status === 'FAILED') {
          es.close();
          onImportError(data.error ?? 'Import nie powiódł się.');
        }
      } catch {
        onImportError('Nie udało się odczytać statusu importu.');
        es.close();
      }
    };

    es.addEventListener('status', handleStatus as EventListener);

    es.onerror = () => {
      // Browser retries EventSource automatically; only fail if CLOSED.
      if (es.readyState === EventSource.CLOSED) {
        onImportError('Połączenie ze statusem importu zostało przerwane.');
      }
    };

    return () => {
      es.removeEventListener('status', handleStatus as EventListener);
      es.close();
    };
  }, [jobId]);

  return {
    startImport,
    status,
    error,
    importing: jobId !== null && !error,
    starting,
    progress: status?.progress ?? 0,
    activeStep: stepIndex(status?.step),
    handleImport,
  };
};
