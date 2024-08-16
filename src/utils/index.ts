export const parseDuration = (duration: string): number => {
  // Convierte la duración ISO 8601 en segundos
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = (parseInt(match[1]) || 0) * 3600;
  const minutes = (parseInt(match[2]) || 0) * 60;
  const seconds = parseInt(match[3]) || 0;

  return hours + minutes + seconds;
};

export const formatDuration = (duration: string): string => {
  const totalSeconds = parseDuration(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatViewCount = (viewCount: number): string => {
  if (viewCount < 1000) {
    return viewCount.toString();
  } else if (viewCount < 1000000) {
    return `${(viewCount / 1000).toFixed(1)}k`;
  } else {
    return `${(viewCount / 1000000).toFixed(1)}m`;
  }
};
