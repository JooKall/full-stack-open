import { useNotificationValue } from '../NotificationContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  const { message, type } = notification
  const style = type === 'error' ? 'danger' : 'success'

  return <Alert variant={style}>{message}</Alert>
}

export default Notification
