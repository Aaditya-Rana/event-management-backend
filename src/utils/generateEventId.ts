import dayjs from "dayjs";

export function generateEventId(date: Date) {
    const month = dayjs(date).format('MMM').toUpperCase();
    const year = dayjs(date).format('YYYY');
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `EVT-${month}${year}-${random}`;
  }