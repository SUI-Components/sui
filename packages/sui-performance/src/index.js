import {IdleQueue} from 'idlefy'

const queue = new IdleQueue({ensureTasksRun: true})

export function delayTask() {
  return new Promise(resolve => {
    setTimeout(resolve, 100)
    requestAnimationFrame(() => {
      setTimeout(resolve, 0)
    })
  })
}

export function delayTaskUntilUrgent(options) {
  return new Promise(resolve => {
    queue.pushTask(resolve, options)
  })
}
