import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Film } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLogin } from "../../features/auth/hooks/useLogin";
import { OAuth2Buttons } from "@/components/oauth";

export default function LoginPage() {
  const { login } = useLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function validate() {
    const e: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Podaj prawidłowy adres e-mail.";
    if (password.length < 5) e.password = "Hasło musi mieć min. 6 znaków.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app", { replace: true });
    } catch {
      setLoading(false);
      setErrors({ email: "Nieprawidłowy e-mail lub hasło." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-sm font-bold">
              L
            </div>
            <span className="font-display text-[15px] font-semibold">
              LangFilm
            </span>
          </Link>

          <h1 className="font-display text-2xl font-semibold">
            Witaj ponownie
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Zaloguj się, aby kontynuować naukę.
          </p>

          <OAuth2Buttons />

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Hasło</Label>
                <Link to="#" className="text-xs text-primary hover:underline">
                  Nie pamiętasz hasła?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
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
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>
            {/* <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(!!v)}
              />
              <Label
                htmlFor="remember"
                className="font-normal text-muted-foreground"
              >
                Zapamiętaj mnie
              </Label>
            </div> */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Logowanie…" : "Zaloguj się"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-linear-to-br from-primary-700 via-primary-600 to-primary-900 lg:flex lg:flex-col lg:justify-end lg:p-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative space-y-5 text-white">
          <Film className="h-9 w-9" />
          <blockquote className="font-display text-2xl font-medium leading-snug">
            "Po dwóch miesiącach codziennej nauki z LangFilm w końcu rozumiem
            angielskie podcasty bez napisów."
          </blockquote>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-10 rounded-full bg-white/20" />
            <div>
              <p className="text-sm font-medium">Agnieszka Nowak</p>
              <p className="text-xs text-white/70">
                Uczy się angielskiego od 4 miesięcy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
