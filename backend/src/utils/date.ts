const calcDays =
  ({ future }: { future: boolean }) =>
  (days: number): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(today.getTime() + (future ? 1 : -1) * days * 24 * 60 * 60 * 1000);
  };

export const daysAgo = calcDays({ future: false });
export const daysAhead = calcDays({ future: true });
