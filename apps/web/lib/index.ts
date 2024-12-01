export function formatTimeAgo(inputTime: number | string): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(inputTime).getTime()) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      if (count === 1) {
        return `a ${interval.label} ago`;
      }
      return `${count} ${interval.label}s ago`;
    }
  }

  return "a few seconds ago";
}
