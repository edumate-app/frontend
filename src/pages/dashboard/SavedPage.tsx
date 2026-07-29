import { PageHeader } from '@/app/layouts/dashboard/components/page-header';
import { ExpressionLibraryPanel } from '@/features/library/components/expression-library-panel';

export default function SavedPage() {
  return (
    <div className="w-full h-full px-4 py-5 sm:px-6 lg:px-8">
      <PageHeader
        title="Biblioteka wyrażeń"
        description="Przeglądaj zapisane słowa i frazy wraz z kontekstami z filmów."
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Biblioteka' }]}
      />

      <ExpressionLibraryPanel />
    </div>
  );
}
