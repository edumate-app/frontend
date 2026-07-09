import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useValidateUrl } from "@/features/dashboard/hooks/useValidateUrl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Film,
  FileText,
  Scissors,
  Languages,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/app/layouts/dashboard/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useImportVideo } from "@/features/dashboard/hooks/useImportVideo";

const steps = [
  { icon: FileText, title: "Pobieramy transkrypcję" },
  { icon: Scissors, title: "Dzielimy na zdania" },
  { icon: Languages, title: "Tłumaczymy i wyjaśniamy" },
  { icon: GraduationCap, title: "Tworzymy materiały do nauki" },
];

export default function AddVideo() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { importVideo } = useImportVideo();
  const {
    lang,
    setLang,
    languages,
    isLoading: fetchingLanguages,
    error: languageError,
    validateUrl,
    handleUrlPaste,
  } = useValidateUrl();

  const selectableLanguages = languages.filter((l) => !l.alreadyImported);
  const singleAlreadyImported =
    languages.length === 1 && languages[0].alreadyImported;

  async function handleImport() {
    if (!url) return;

    setLoading(true);

    try {
      const videoId = await importVideo(url, lang);
      navigate(`/app/videos/${videoId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-7xl px-4 py-15 sm:px-6 lg:px-8 ml-20">
      <div className="max-w-2xl space-y-5">
        <PageHeader
          title="Dodaj nowy film"
          breadcrumbs={[{ label: "Moje filmy" }, { label: "Dodaj film" }]}
          description="Wklej link do filmu z YouTube, a my zajmiemy się resztą."
        />

        <Card>
          <CardContent className="pt-5 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="url">Link do filmu YouTube</Label>
              <div className="relative">
                <Film className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onPaste={handleUrlPaste}
                  onBlur={() => void validateUrl(url)}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Język filmu</Label>
              <Select
                value={lang}
                onValueChange={setLang}
                disabled={fetchingLanguages || languages.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      fetchingLanguages
                        ? "Wykrywanie dostępnych języków…"
                        : "Wklej link, aby wyświetlić języki"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((item) => (
                    <SelectItem
                      key={item.language_code}
                      value={item.language_code}
                      disabled={item.alreadyImported}
                    >
                      {item.language}
                      {item.alreadyImported ? " (już zaimportowany)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {singleAlreadyImported ? (
                <p className="text-xs text-muted-foreground">
                  Ten film został już zaimportowany w języku{" "}
                  {languages[0].language}.
                </p>
              ) : null}
              {languageError ? (
                <p className="text-xs text-destructive">{languageError}</p>
              ) : null}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleImport}
              disabled={
                !url ||
                !lang ||
                loading ||
                fetchingLanguages ||
                selectableLanguages.length === 0
              }
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Importowanie filmu…" : "Importuj film"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Jak to działa?</CardTitle>
            <CardDescription>
              Cały proces trwa zwykle mniej niż minutę.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 pt-0 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${loading ? "bg-primary-100 text-primary-600 animate-pulse" : "bg-secondary text-muted-foreground"}`}
                >
                  <s.icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-2xs leading-snug text-muted-foreground">
                  {i + 1}. {s.title}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
