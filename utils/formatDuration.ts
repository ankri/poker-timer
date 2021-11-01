export const formatDuration = (durationInMinutes: number) => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  let result: string[] = [];

  if (hours > 0) {
    result = [`${hours}h`];
  }
  if (minutes > 0) {
    result = [...result, `${minutes}min`];
  }

  return result.join(" ");
};
