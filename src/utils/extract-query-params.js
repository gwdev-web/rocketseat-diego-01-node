/**
 * Converts a query string like `?search=node&page=2`
 * into an object: { search: 'node', page: '2' }.
 */
export function extractQueryParams(query) {
  if (!query) return {}

  return Object.fromEntries(new URLSearchParams(query))
}
