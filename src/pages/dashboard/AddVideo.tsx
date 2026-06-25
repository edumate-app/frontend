import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const steps = [
  { icon: FileText, title: "Pobieramy transkrypcję" },
  { icon: Scissors, title: "Dzielimy na zdania" },
  { icon: Languages, title: "Tłumaczymy i wyjaśniamy" },
  { icon: GraduationCap, title: "Tworzymy materiały do nauki" },
];

export default function AddVideo() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("auto");
  const [loading, setLoading] = useState(false);

  function handleImport() {
    if (!url) return;
    setLoading(true);
    setTimeout(() => navigate("/"), 1600);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 ">
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
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Język filmu (wykryty automatycznie)</Label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger>
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleImport}
            disabled={!url || loading}
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
  );
}
