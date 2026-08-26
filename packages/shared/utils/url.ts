export const createQueryString = (
  params: Record<string, string | number | undefined>,
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};
