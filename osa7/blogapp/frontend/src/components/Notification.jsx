import { useNotificationValue } from '../NotificationContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  const { message, type } = notification

  const style1 = {
    backgroundColor: 'lightgrey',
    margin: '10px',
    padding: '10px',
    border: '2px solid',
    borderColor: type === 'error' ? 'red' : 'green',
    borderRadius: '5px',
  }

  const style = type === 'error' ? 'danger' : 'success'

  return <Alert variant={style}>{message}</Alert>
}

export default Notification
