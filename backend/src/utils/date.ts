export const daysAgo = (days: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
};
