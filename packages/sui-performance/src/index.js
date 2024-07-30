import {IdleQueue} from 'idlefy'

export function delayTask() {
  return new Promise(resolve => {
    setTimeout(resolve, 100)
    requestAnimationFrame(() => {
      setTimeout(resolve, 0)
    })
  })
}

export function delayTaskUntilUrgent(options) {
  const queue = new IdleQueue({ensureTasksRun: true})

  return new Promise(resolve => {
    queue.pushTask(resolve, options)
  })
}
