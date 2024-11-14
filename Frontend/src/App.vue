<script setup>
import { onMounted, ref } from 'vue'

const apiUrl = import.meta.env.VITE_BASE_URL

const taskName = ref('')
const allTask = ref([])
const editTaskId = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(`${apiUrl}/tasks`)
    if (res.ok) {
      allTask.value = await res.json()
      console.log(allTask.value)
    }
  } catch (error) {
    console.log(error)
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

const addTask = async () => {
  try {
    const addedTask = await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task_name: taskName.value,
        status: 'pending'
      })
    })

    const newTask = await addedTask.json()
    console.log(newTask)

    if (addedTask.ok) {
      allTask.value.push(newTask)
    }

    console.log(addedTask)
    taskName.value = ''
  } catch (error) {
    console.log(error)
  }
}

const deleteTask = async (taskId) => {
  try {
    const deletedTask = await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: 'DELETE'
    })
    if (deletedTask.ok) {
      allTask.value = allTask.value.filter((task) => task.id !== taskId)
    }
  } catch (error) {
    console.log(error)
  }
}

const editTask = (taskId) => {
  if (editTaskId.value === taskId) {
    editTaskId.value = null
  } else {
    editTaskId.value = taskId
  }
}

const saveTask = async (task) => {
  try {
    const res = await fetch(`${apiUrl}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        task_name: task.taskName,
        status: task.status
      })
    })

    if (res.ok) {
      const editedTask = await res.json()
      console.log(editTaskId.value)

      const indexTask = allTask.value.findIndex(
        (oldTask) => oldTask.id === task.id
      )

      if (indexTask !== -1) {
        allTask.value[indexTask] = editedTask
        editTaskId.value = null
      }
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <h1 class="text-4xl font-bold mb-14">ToDo List</h1>
    <div class="mb-4">
      <input
        v-model="taskName"
        type="text"
        placeholder="Enter task name"
        class="p-2 border rounded-md w-64 mb-6"
      />
      <button
        class="ml-6 rounded-md w-full sm:w-auto mt-2 sm:mt-4 p-[7px] bg-green-300 text-white"
        @click="addTask()"
      >
        Add
      </button>
    </div>

    <div class="w-full max-w-xl">
      <ul class="space-y-4">
        <li
          v-for="task in allTask"
          :key="task.id"
          class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <div v-if="editTaskId === task.id">
              <input
                v-model="task.taskName"
                type="text"
                class="p-2 border border-gray-300 rounded-md"
              />
              <br />
              <select
                v-model="task.status"
                class="mt-1 p-1 border border-gray-300 rounded-md text-xs"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <p class="text-xs text-gray-400">
                Latest Updated : {{ formatDate(task.updatedAt) }}
              </p>
            </div>
            <div v-else>
              <p class="font-semibold text-lg">{{ task.taskName }}</p>
              <p class="text-sm text-gray-500">{{ task.status }}</p>
              <p class="text-xs text-gray-400">
                Created At : {{ formatDate(task.createdAt) }}
              </p>
            </div>
          </div>
          <div class="space-x-8">
            <button
              class="text-sm text-red-500 hover:text-red-700"
              @click="deleteTask(task.id)"
            >
              Delete
            </button>
            <button
              class="text-sm text-blue-500 hover:text-blue-700"
              @click="editForm === task.id ? saveTask(task) : editTask(task.id)"
            >
              {{ editTaskId === task.id ? 'Cancel' : 'Edit' }}
            </button>
            <button
              v-if="editTaskId === task.id"
              class="text-sm text-green-500 hover:text-green-700"
              @click="saveTask(task)"
            >
              Save
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
