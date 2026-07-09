import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  MoreHorizontal,
  Flame,
  Clock,
  BookOpen,
  Plus,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/app/layouts/dashboard/components/page-header";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { timeAgo } from "@/features/dashboard/utils/time";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { videos, isLoading, error } = useDashboard();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <PageHeader
          title={`Witaj ponownie, ${user?.name.split(" ")[0]}! 👋`}
          description="Gotowy na kolejną sesję nauki?"
          actions={
            <Button asChild>
              <Link to="/app/videos/new">
                <Plus className="h-4 w-4" /> Dodaj nowy film
              </Link>
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Dzisiaj do powtórki
              </span>
              <Clock className="h-4 w-4 text-muted-foreground/70" />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <span className="font-display text-3xl font-semibold">
                24{" "}
                <span className="text-base font-normal text-muted-foreground">
                  karty
                </span>
              </span>
              <Flame className="h-9 w-9 text-warning/30" />
            </div>
            <Button size="sm" className="w-full mt-15" asChild>
              <Link to="/dashboard/review">Rozpocznij sesję</Link>
            </Button>
          </Card>

          <Card className="p-5">
            <span className="text-xs font-medium text-muted-foreground">
              Twój postęp
            </span>
            <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <p className="flex items-center gap-1 font-display text-lg font-semibold">
                  12 <Flame className="h-4 w-4 text-warning" />
                </p>
                <p className="text-2xs text-muted-foreground">
                  Dni nauki z rzędu
                </p>
              </div>
              <div>
                <p className="font-display text-lg font-semibold">1 248</p>
                <p className="text-2xs text-muted-foreground">
                  Nauczone zdania
                </p>
              </div>
              <div>
                <p className="font-display text-lg font-semibold">18h 32m</p>
                <p className="text-2xs text-muted-foreground">
                  Łączny czas nauki
                </p>
              </div>
              <div>
                <p className="font-display text-lg font-semibold">24</p>
                <p className="text-2xs text-muted-foreground">
                  Powtórki dzisiaj
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/stats"
              className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
            >
              Zobacz statystyki →
            </Link>
          </Card>

          <Card className="p-5 hidden lg:block">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Twój kalendarz nauki
              </span>
              <Calendar className="h-4 w-4 text-muted-foreground/70" />
            </div>

            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-2xs text-muted-foreground">Maj</p>
                <div className="mt-2 grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div
                      key={`may-${i}`}
                      className={`h-4 w-4 flex items-center justify-center text-[10px] rounded-sm ${
                        [
                          2, 3, 4, 6, 7, 9, 10, 12, 13, 14, 16, 18, 20, 21, 23,
                          24, 25, 26, 27,
                        ].includes(i)
                          ? "bg-primary-400"
                          : "bg-muted"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden xl:block">
                <p className="text-2xs text-muted-foreground">Czerwiec</p>
                <div className="mt-2 grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={`jun-${i}`}
                      className={`h-4 w-4 flex items-center justify-center text-[10px] rounded-sm ${
                        [1, 2, 5, 6, 8, 9, 12, 15, 18, 21, 24, 27].includes(i)
                          ? "bg-primary-400"
                          : "bg-muted"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-3 text-2xs text-muted-foreground">
              19 z ostatnich 28 dni z aktywnością
            </p>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold">Twoje filmy</h2>
            <Link
              to="/dashboard/videos"
              className="text-xs font-medium text-primary hover:underline"
            >
              Zobacz wszystkie
            </Link>
          </div>

          <Card className="overflow-hidden">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Ładowanie...</p>
            ) : error ? (
              <p className="p-4 text-sm text-destructive">{error}</p>
            ) : (
            <div className="divide-y divide-border">
              {videos.slice(0, 3).map((v) => (
                <Link
                  to={`/app/videos/${v.uuid}`}
                  key={v.uuid}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors"
                >
                  <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md">
                    <img
                      src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                      alt={v.title}
                      className="h-full w-full object-cover"
                    />
                    <Play className="absolute inset-0 m-auto h-4 w-4 fill-white text-white drop-shadow" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{v.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {v.author} · {v.targetLang.toUpperCase()}
                    </p>
                  </div>
                  {/* To do: Implement progress tracking */}
                  <div className="hidden w-40 items-center gap-2 sm:flex">
                    <Progress value={67} className="h-1.5" />
                    <span className="w-9 shrink-0 text-right text-xs text-muted-foreground">
                      {67}%
                    </span>
                  </div>
                  <span className="hidden w-28 shrink-0 text-right text-2xs text-muted-foreground md:block">
                    {timeAgo(v.lastOpenedAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
            )}
          </Card>
        </div>

        <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between bg-primary-50 border-primary-100">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm font-medium text-primary-800">
                Masz 5 nowych zdań do zapisania z filmu „How to Build Habits"
              </p>
              <p className="text-xs text-primary-600/80">
                Dokończ lekcję, by je utrwalić
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-primary-300 bg-surface"
            asChild
          >
            <Link to="/dashboard/videos/build-habits">Kontynuuj</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
