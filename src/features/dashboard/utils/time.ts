export function timeAgo(dateString: string | null): string {
  if (!dateString) {
    return "Nigdy nie otwierano";
  }

  const date = new Date(dateString);
  const now = new Date();

  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) {
    return "przed chwilą";
  }

  const minutes = Math.floor(diffSeconds / 60);

  if (minutes < 60) {
    return `${minutes} min temu`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} godz. temu`;
  }

  const days = Math.floor(hours / 24);

  return `${days} dni temu`;
}
