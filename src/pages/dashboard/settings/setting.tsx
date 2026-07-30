'use client';

import { PageHeader } from '@/app/layouts/dashboard/components/page-header';
import { NativeLangSettings } from './components/native-lang-settings';
import { ProfilePhotoSettings } from './components/profile-photo-settings';

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <PageHeader
          title="Ustawienia"
          breadcrumbs={[{ label: 'Dashboard' }, { label: 'Ustawienia' }]}
        />
        <div className="space-y-6">
          <ProfilePhotoSettings />
          <NativeLangSettings />
        </div>
      </div>
    </div>
  );
}
