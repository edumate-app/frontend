import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, CheckCircle2, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { OAuth2Buttons } from "@/components/oauth";

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const labels = ["Bardzo słabe", "Słabe", "Średnie", "Dobre", "Silne"];
const colors = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-info",
  "bg-success",
];

export default function RegisterPage() {
  const { register } = useRegister();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const score = useMemo(() => strength(password), [password]);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Podaj imię i nazwisko.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Podaj prawidłowy adres e-mail.";
    if (score < 2) e.password = "Hasło jest zbyt słabe.";
    if (confirm !== password) e.confirm = "Hasła nie są zgodne.";
    if (!terms) e.terms = "Musisz zaakceptować regulamin.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard", { replace: true }), 1400);
    } catch {
      setErrors({ email: "Registration failed. Please try again" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-sm animate-slide-up">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-xl font-semibold">
            Konto utworzone!
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Witaj w LangFilm, {name.split(" ")[0]}. Przenosimy Cię do wyboru
            języków…
          </p>
          <Loader2 className="mt-5 h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-linear-to-br from-primary-900 via-primary-700 to-primary-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Film className="h-9 w-9 text-white" />
        <div className="space-y-4 text-white">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Dołącz do 48 000+ osób uczących się z filmów
          </h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Pierwszy film za darmo, bez
              karty
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Tłumaczenia i wyjaśnienia AI
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Powtórki dopasowane do
              Twojego tempa
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-sm font-bold">
              L
            </div>
            <span className="font-display text-[15px] font-semibold">
              LangFilm
            </span>
          </Link>

          <h1 className="font-display text-2xl font-semibold">Utwórz konto</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Zacznij naukę już za chwilę.
          </p>

          <OAuth2Buttons />

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name">Imię i nazwisko</Label>
              <Input
                id="name"
                placeholder="Jan Kowalski"
                value={name}
                error={!!errors.name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Adres e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="ty@przyklad.pl"
                value={email}
                error={!!errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 znaków"
                  value={password}
                  error={!!errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full bg-muted",
                          i < score && colors[score],
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-2xs text-muted-foreground">
                    {labels[score]}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Potwierdź hasło</Label>
              <Input
                id="confirm"
                type={showPw ? "text" : "password"}
                placeholder="Powtórz hasło"
                value={confirm}
                error={!!errors.confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {errors.confirm && (
                <p className="text-xs text-destructive">{errors.confirm}</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={terms}
                  onCheckedChange={(v) => setTerms(!!v)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="terms"
                  className="font-normal text-muted-foreground leading-snug"
                >
                  Akceptuję{" "}
                  <a href="#" className="text-primary hover:underline">
                    regulamin
                  </a>{" "}
                  oraz{" "}
                  <a href="#" className="text-primary hover:underline">
                    politykę prywatności
                  </a>
                  .
                </Label>
              </div>
              {errors.terms && (
                <p className="text-xs text-destructive">{errors.terms}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Tworzenie konta…" : "Zacznij za darmo"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Masz już konto?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
