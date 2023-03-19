export default async function fetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  return global.fetch(input, {
    ...init,
    next: { revalidate: 10 },
    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
  });
}
