import Task from '#models/task'
import type { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
  async getAllTask({ response }: HttpContext) {
    const tasks = await Task.query()
    return response.json(tasks)
  }

  async createTask({ request, response }: HttpContext) {
    try {
      const req = request.only(['task_name', 'status'])
      if (!req.task_name) {
        return response.status(400).json({ messages: 'User needs to add task name' })
      }
      const createdTask = await Task.create(req)
      return createdTask
    } catch (error) {
      console.log(error)
    }
  }

  async deleteTask({ response, params }: HttpContext) {
    const deleteId = params.id
    console.log(deleteId)
    try {
      const findTask = await Task.findByOrFail('id', deleteId)

      if (!findTask) {
        return response.status(404).json({ messages: 'This TaskId is not found' })
      }
      await findTask.delete()
    } catch (error) {
      console.log(error)
    }
  }

  async updateTask({ params, request, response }: HttpContext) {
    try {
      const findTask = await Task.findByOrFail('id', params.id)

      if (!findTask) {
        return response.status(404).json({ messages: 'This TaskId is not found' })
      }

      const data = request.only(['task_name', 'status'])

      findTask.merge(data)
      await findTask.save()

      return findTask
    } catch (error) {
      console.log(error)
    }
  }
}
