/**
 * Turns a route path like `/tasks/:id/complete` into a RegExp with named
 * groups, e.g. `^/tasks/(?<id>[^/?]+)/complete(?<query>\?(.*))?$`.
 */
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[^/?]+)')

  return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
}
