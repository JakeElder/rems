export default async function fetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  return global.fetch(input, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
  });
}
