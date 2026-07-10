import type { AuthProvider } from '@/features/auth/api/auth.types';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { env } from '@/utils/env';

export const OAuth2Buttons = () => {
  const redirectToOAuth = (provider: AuthProvider) => {
    window.location.href = `${env.VITE_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => redirectToOAuth('google')}
        >
          <GoogleIcon />
          Google
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={() => redirectToOAuth('github')}
        >
          <GithubIcon />
          GitHub
        </Button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-2xs text-muted-foreground">lub e-mailem</span>
        <Separator className="flex-1" />
      </div>
    </>
  );
};

const GoogleIcon = () => {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.95l3.66-2.85z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
};

const GithubIcon = () => {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 .5C5.73.5.75 5.7.75 12.34c0 5.3 3.44 9.79 8.2 11.38.6.12.82-.27.82-.6v-2.1c-3.34.75-4.04-1.66-4.04-1.66-.55-1.45-1.34-1.84-1.34-1.84-1.1-.78.08-.77.08-.77 1.22.09 1.86 1.3 1.86 1.3 1.08 1.9 2.82 1.35 3.5 1.03.1-.8.42-1.35.76-1.66-2.66-.31-5.46-1.38-5.46-6.14 0-1.36.47-2.47 1.24-3.34-.13-.31-.54-1.56.12-3.26 0 0 1.01-.33 3.3 1.27.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.28-1.6 3.29-1.27 3.29-1.27.66 1.7.25 2.95.12 3.26.77.87 1.24 1.98 1.24 3.34 0 4.77-2.8 5.83-5.47 6.13.43.38.81 1.12.81 2.26v3.35c0 .33.22.73.83.6 4.76-1.59 8.19-6.08 8.19-11.38C23.25 5.7 18.27.5 12 .5z" />
    </svg>
  );
};
