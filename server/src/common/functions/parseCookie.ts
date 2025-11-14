export function parseCookie(cookieHeader: string | undefined) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...v] = c.trim().split('=');
      return [key, decodeURIComponent(v.join('='))];
    }),
  );
}
