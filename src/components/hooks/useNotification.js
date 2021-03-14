import { useRef } from 'react'

import { createContainer } from 'unstated-next'

const useNotification = () => {
  const notificationSystem = useRef(null)

  let lastNotification = null
  const push = (payload, action = undefined) => {
    // Fix duplicated notification.
    if (lastNotification) {
      notificationSystem.current.removeNotification(lastNotification)
    }

    lastNotification = notificationSystem.current.addNotification({
      message: payload,
      position: 'tc',
      level: 'success',
      action,
    })
  }

  return { ref: notificationSystem, push }
}

export default createContainer(useNotification)
