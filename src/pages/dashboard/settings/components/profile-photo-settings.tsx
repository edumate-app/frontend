import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ImagePlus, Trash2, Upload } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useUpdateProfilePhoto } from '@/features/dashboard/hooks/useUpdateProfilePhoto';

const ACCEPTED_FILE_TYPES = 'image/png,image/jpeg,image/webp';
const MAX_FILE_SIZE_MB = 5;

type ProfilePhotoSettingsProps = {
  currentImageUrl?: string | null;
};

export function ProfilePhotoSettings({
  currentImageUrl = null,
}: ProfilePhotoSettingsProps) {
  const { user } = useAuthStore();
  const {
    updateProfilePhoto,
    deleteProfilePhoto,
    isLoading,
    error: requestError,
  } = useUpdateProfilePhoto();
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedCurrentImageUrl = currentImageUrl ?? user?.avatarUrl ?? null;
  const fallbackInitials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    resolvedCurrentImageUrl,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const hasStoredPhoto = Boolean(resolvedCurrentImageUrl);
  const isPreviewingNewPhoto = Boolean(selectedFile);

  useEffect(() => {
    setPreviewUrl(resolvedCurrentImageUrl);
  }, [resolvedCurrentImageUrl]);

  useEffect(() => {
    if (!selectedFile) return undefined;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleSelectClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isAcceptedType = ACCEPTED_FILE_TYPES.split(',').includes(file.type);
    const isAcceptedSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!isAcceptedType) {
      setValidationError('Dozwolone formaty to PNG, JPG i WEBP.');
      event.target.value = '';
      return;
    }

    if (!isAcceptedSize) {
      setValidationError(`Maksymalny rozmiar pliku to ${MAX_FILE_SIZE_MB} MB.`);
      event.target.value = '';
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(resolvedCurrentImageUrl);
    setValidationError(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(resolvedCurrentImageUrl);
    setValidationError(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDeleteCurrentPhoto = async () => {
    if (!hasStoredPhoto) return;

    try {
      await deleteProfilePhoto();
      setSelectedFile(null);
      setPreviewUrl(null);
      setValidationError(null);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch {
      // Error message is exposed from the hook and rendered below the input.
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      await updateProfilePhoto(selectedFile);
      setSelectedFile(null);
      setValidationError(null);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch {
      // Error message is exposed from the hook and rendered below the input.
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zdjęcie profilowe</CardTitle>
        <CardDescription>
          Zmień swoje zdjęcie profilowe albo usuń aktualny avatar.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-3 md:w-48">
            <Avatar className="h-28 w-28 border-2 border-border shadow-sm">
              {previewUrl && (
                <AvatarImage src={previewUrl} alt="Podgląd avatara" />
              )}
              <AvatarFallback className="text-sm">
                {fallbackInitials || <Camera className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">
                {isPreviewingNewPhoto
                  ? 'Podgląd nowego zdjęcia'
                  : hasStoredPhoto
                    ? 'Aktualne zdjęcie profilowe'
                    : 'Brak zdjęcia profilowego'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP do {MAX_FILE_SIZE_MB} MB
              </p>
              {selectedFile && (
                <p className="max-w-40 truncate text-xs text-muted-foreground">
                  {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-photo-upload">Nowe zdjęcie</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="profile-photo-upload"
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start sm:flex-1"
                  onClick={handleSelectClick}
                  disabled={isLoading}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {selectedFile ? 'Zmień plik' : 'Wybierz zdjęcie'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemoveSelection}
                  disabled={!selectedFile || isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Odrzuć wybór
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Najpierw wybierz plik, a potem zapisz zmiany na koncie.
              </p>
              {(validationError || requestError) && (
                <p className="text-xs text-destructive">
                  {validationError ?? requestError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {' '}
              <div className="mr-auto shrink-0">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteCurrentPhoto}
                  disabled={!hasStoredPhoto || isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Usuń aktualne zdjęcie
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!selectedFile || isLoading}
              >
                Anuluj
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!selectedFile || isLoading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? 'Zapisywanie...' : 'Zapisz zdjęcie'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
