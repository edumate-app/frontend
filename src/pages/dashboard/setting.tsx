"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/app/layouts/dashboard/components/page-header";
import { LANGUAGES } from "@/features/dashboard/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useUpdateNativeLang } from "@/features/dashboard/hooks/useUpdateNativeLang";

export default function SettingsPage() {
  const { user } = useAuthStore();

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState("");

  const { updateNativeLang } = useUpdateNativeLang();

  useEffect(() => {
    if (!user?.nativeLang) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedLanguage(user.nativeLang);
    setOriginalLanguage(user.nativeLang);
  }, [user?.nativeLang]);

  const isLanguageChanged = selectedLanguage !== originalLanguage;

  const handleSave = async () => {
    setIsLoading(true);
    await updateNativeLang(selectedLanguage);
    setOriginalLanguage(selectedLanguage);
    setIsLoading(false);
  };

  const hasNativeLang = user?.nativeLang && user.nativeLang !== "";

  return (
    <div className="mx-auto w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-6">
        <PageHeader
          title="Ustawienia"
          breadcrumbs={[{ label: "Dashboard" }, { label: "Ustawienia" }]}
        />

        {!hasNativeLang && (
          <Alert
            variant="destructive"
            className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
          >
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">Wybór języka wymagany!</span>
              <br />
              Aby rozpocząć naukę, wybierz swój język ojczysty w ustawieniach
              profilu językowego.
            </AlertDescription>
          </Alert>
        )}

        <Card
          className={
            !hasNativeLang
              ? "border-2 border-yellow-500 shadow-lg shadow-yellow-500/20"
              : ""
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profil językowy
              {!hasNativeLang && (
                <span className="text-xs font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                  Wymagane
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {hasNativeLang
                ? "Dostosuj języki i poziom trudności"
                : "⚠️ Wybierz swój język ojczysty, aby kontynuować naukę"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Twój język (native)
                  {!hasNativeLang && (
                    <span className="text-yellow-600 ml-1">*</span>
                  )}
                </Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger
                    className={
                      !hasNativeLang
                        ? "border-yellow-500 focus:ring-yellow-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Wybierz język" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name} ({language.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!hasNativeLang && !isLanguageChanged && (
                  <p className="text-xs text-yellow-600 mt-1">
                    * Pole wymagane do rozpoczęcia nauki
                  </p>
                )}
              </div>
            </div>

            {isLanguageChanged && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <span className="font-medium">Zmieniono język:</span>{" "}
                {LANGUAGES.find((l) => l.code === originalLanguage)?.name} (
                {LANGUAGES.find((l) => l.code === originalLanguage)?.code}) →{" "}
                {LANGUAGES.find((l) => l.code === selectedLanguage)?.name}
              </div>
            )}

            {!hasNativeLang && (
              <div className="text-sm bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  💡 Wskazówka:
                </span>
                <span className="text-blue-600 dark:text-blue-400 ml-1">
                  Wybierz język, którym posługujesz się na co dzień. Będzie on
                  używany jako język bazowy do nauki nowych słówek.
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedLanguage(originalLanguage);
              }}
              disabled={!isLanguageChanged || isLoading}
            >
              Anuluj
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={
                !selectedLanguage ||
                (!isLanguageChanged && hasNativeLang) ||
                isLoading
              }
              className={
                !hasNativeLang && selectedLanguage
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : ""
              }
            >
              {isLoading
                ? "Zapisywanie..."
                : hasNativeLang
                  ? "Zapisz zmiany"
                  : "Zapisz i kontynuuj"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
