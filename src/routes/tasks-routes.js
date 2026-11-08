import * as tasksController from '../controllers/tasks-controller.js'
import { buildRoutePath } from '../utils/build-route-path.js'

export const tasksRoutes = [
  { method: 'POST', path: buildRoutePath('/tasks'), handler: tasksController.create },
  { method: 'GET', path: buildRoutePath('/tasks'), handler: tasksController.list },
  { method: 'PUT', path: buildRoutePath('/tasks/:id'), handler: tasksController.update },
  { method: 'DELETE', path: buildRoutePath('/tasks/:id'), handler: tasksController.remove },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: tasksController.toggleComplete,
  },
]
