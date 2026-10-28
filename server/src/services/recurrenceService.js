export const getNextDate = (dueAt, recurrence) => {
  if (!recurrence || recurrence.frequency === "none") return null;

  const interval = recurrence.interval || 1;
  const next = new Date(dueAt);

  if (recurrence.frequency === "daily")
    next.setUTCDate(next.getUTCDate() + interval);
  if (recurrence.frequency === "weekly")
    next.setUTCDate(next.getUTCDate() + 7 * interval);
  if (recurrence.frequency === "monthly")
    next.setUTCMonth(next.getUTCMonth() + interval);

  if (recurrence.until && next > recurrence.until) return null;
  return next;
};
