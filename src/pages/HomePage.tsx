import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Quote,
  Clapperboard,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { UserMenu } from "@/components/UserMenu";

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasCheckedAuth = useAuthStore((s) => s.hasCheckedAuth);

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Clapperboard size={15} className="text-white" />
              </div>
              <span className="font-bold text-ink text-lg tracking-tight">
                LangFilm
              </span>
            </div>
          </Link>
          {hasCheckedAuth &&
            (!isAuthenticated ? (
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Zaloguj się</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Zacznij za darmo</Link>
                </Button>
              </div>
            ) : (
              <UserMenu />
            ))}
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <Badge
            variant="outline"
            className="mb-5 gap-1.5 border-primary-200 bg-primary-50 text-primary-700"
          >
            <Sparkles className="h-3 w-3" /> Nowość: tłumaczenia z kontekstem AI
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Ucz się języków
            <br />z filmów YouTube
            <br />
            <span className="text-primary">zdanie po zdaniu</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground">
            Wklej link do filmu, a my zajmiemy się resztą. Tłumaczymy,
            wyjaśniamy i uczymy Cię w efektywny sposób.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link to="/register">Wypróbuj za darmo</Link>
            </Button>
            <Button size="lg" variant="ghost" className="gap-1.5">
              Zobacz jak to działa <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {["Szybki start", "AI wyjaśnienia", "Skuteczne powtórki"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-border bg-surface p-3 shadow-lg">
            <div className="flex aspect-video items-center justify-center rounded-lg bg-linear-to-br from-primary-900 to-primary-700">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <Play className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
          </div>
          <div className="absolute -right-6 -top-6 w-64 rounded-lg border border-border bg-surface p-4 shadow-lg animate-slide-up hidden sm:block">
            <div className="flex items-start gap-2">
              <Quote className="h-4 w-4 shrink-0 text-primary-400" />
              <div>
                <p className="text-sm font-medium leading-snug">
                  "I'm not sure that's a good idea."
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nie jestem pewien, czy to dobry pomysł.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -left-6 w-72 rounded-lg border border-border bg-surface p-4 shadow-lg hidden sm:block">
            <p className="text-2xs font-semibold uppercase tracking-wide text-primary-600">
              Wyjaśnienie
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">
                "I'm not sure"
              </span>{" "}
              – nie jestem pewien – that's a good idea. Wyrażenie to służy do
              wyrażania wątpliwości.
            </p>
          </div>
        </div>
      </section>

      <section id="funkcje" className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold">
            Wszystko, czego potrzebujesz do nauki
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Play,
                title: "Import z YouTube",
                desc: "Wklej dowolny link, a system pobierze transkrypcję i podzieli ją na zdania.",
              },
              {
                icon: Sparkles,
                title: "AI tłumaczenie i wyjaśnienia",
                desc: "Każde zdanie zostaje przetłumaczone i wyjaśnione w kontekście gramatycznym.",
              },
              {
                icon: RotateCcw,
                title: "Inteligentne powtórki SRS",
                desc: "Algorytm odstępów dba o to, byś zapamiętał słówka na dłużej.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 LangFilm. Wszystkie prawa zastrzeżone.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">
              Regulamin
            </a>
            <a href="#" className="hover:text-foreground">
              Prywatność
            </a>
            <a href="#" className="hover:text-foreground">
              Kontakt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
