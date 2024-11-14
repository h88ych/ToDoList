/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const TasksController = () => import('#controllers/tasks_controller')
import router from '@adonisjs/core/services/router'

router.on('/').redirect('/tasks')

router.get('/tasks', [TasksController, 'getAllTask']).as('todo.home')

router.post('/tasks', [TasksController, 'createTask']).as('todo.create')

router.delete('/tasks/:id', [TasksController, 'deleteTask']).as('todo.delete')

router.put('/tasks/:id', [TasksController, 'updateTask']).as('todo.update')
