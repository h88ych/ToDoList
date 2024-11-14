import Task from '#models/task'
import type { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
  async index({ res }: HttpContext) {
    const tasks = await Task.query()
    console.log(tasks)
    return tasks
  }
}
