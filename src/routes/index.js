import { tasksRoutes } from './tasks-routes.js'

/**
 * All application routes. Each route is { method, path: RegExp, handler }.
 */
export const routes = [...tasksRoutes]
