import dayjs from "dayjs";

export const formatDateTime = (date: string): string =>
  dayjs(date).format("YYYY-MM-DD HH:mm:ss");
