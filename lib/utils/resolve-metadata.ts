export function resolveMetadataBase() {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return new URL(raw);
}
